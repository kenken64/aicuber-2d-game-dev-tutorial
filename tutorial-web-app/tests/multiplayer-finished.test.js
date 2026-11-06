import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { test } from 'node:test';
import { WebSocket } from 'ws';
import { attachMultiplayerRooms } from '../multiplayer-rooms.mjs';

test('finishing a round broadcasts grounded, idle players', async () => {
  const server = createServer();
  const { rooms } = attachMultiplayerRooms(server);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const url = `ws://127.0.0.1:${server.address().port}/ws/multiplayer`;
  const one = new WebSocket(url);
  const two = new WebSocket(url);
  try {
    await Promise.all([once(one, 'open'), once(two, 'open')]);
    const messages = [];
    one.on('message', data => messages.push(JSON.parse(data)));
    const waitFor = async predicate => {
      const deadline = Date.now() + 3000;
      while (!predicate()) {
        if (Date.now() > deadline) throw new Error('Timed out waiting for room state');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    };
    one.send(JSON.stringify({ type: 'host', slot: 1 }));
    await waitFor(() => rooms.size === 1);
    const room = [...rooms.values()][0];
    two.send(JSON.stringify({ type: 'join', slot: 2, code: room.code }));
    await waitFor(() => room.members.size === 2);
    one.send(JSON.stringify({ type: 'ready', ready: true }));
    two.send(JSON.stringify({ type: 'ready', ready: true }));
    await waitFor(() => room.phase === 'playing');
    room.game.collected = [0, 1, 2, 3, 4, 5, 6];
    Object.assign(room.game.players[0], { x: 610, feetY: 282, velocityY: 0, moving: true });
    Object.assign(room.game.players[1], { x: 300, feetY: 200, velocityY: -100, moving: true });
    room.members.get(1).input.right = true;
    room.members.get(2).input.left = true;
    await waitFor(() => messages.some(message => message.type === 'state' && message.state.collected.length === 8));
    assert.equal(room.phase, 'finished');
    const finalState = messages.find(message => message.type === 'state' && message.state.collected.length === 8).state;
    for (const player of finalState.players) {
      assert.equal(player.moving, false);
      assert.equal(player.feetY, 318);
      assert.equal(player.velocityY, 0);
    }
  } finally {
    one.terminate();
    two.terminate();
    await new Promise(resolve => server.close(resolve));
  }
});
