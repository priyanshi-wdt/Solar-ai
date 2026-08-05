function clearInactivityTimers(socket) {
  clearTimeout(socket.reminder1);
  clearTimeout(socket.reminder2);
  clearTimeout(socket.reminder3);
  clearTimeout(socket.endTimer);
}

function startInactivityTimers(socket, endChat) {
  clearInactivityTimers(socket);

  // 2 Minutes
  socket.reminder1 = setTimeout(() => {
    if (socket.readyState !== 1) return;

    socket.send(
      JSON.stringify({
        type: "TEXT",
        text: "Are you still there?",
      })
    );
  }, 2 * 60 * 1000);

  // 3.5 Minutes
  socket.reminder2 = setTimeout(() => {
    if (socket.readyState !== 1) return;

    socket.send(
      JSON.stringify({
        type: "TEXT",
        text: "Just checking in. Are you still with me?",
      })
    );
  }, 3.5 * 60 * 1000);

  // 5 Minutes
  socket.reminder3 = setTimeout(() => {
    if (socket.readyState !== 1) return;

    socket.send(
      JSON.stringify({
        type: "TEXT",
        text: "I'll automatically close this conversation in about a minute if I don't hear back from you.",
      })
    );
  }, 5 * 60 * 1000);

  // 6 Minutes
  socket.endTimer = setTimeout(async () => {
    if (socket.readyState !== 1) return;

    socket.send(
      JSON.stringify({
        type: "TEXT",
        text: "This conversation has been closed due to inactivity. Feel free to start a new chat anytime.",
      })
    );

    await endChat(socket);

    socket.close();

  }, 6 * 60 * 1000);
}

module.exports = {
  startInactivityTimers,
  clearInactivityTimers,
};