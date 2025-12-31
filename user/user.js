async function fetchRoomMembers() {
  if (!this.accessToken || !this.roomId) return;

  try {
    const res = await fetch(
      `https://matrix.org/_matrix/client/r0/rooms/${encodeURIComponent(this.roomId)}/joined_members`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    );

    const data = await res.json();

    this.roomMembers = Object.entries(data.joined || {}).map(
      ([userId, info]) => ({
        userId,
        displayName: info.display_name || userId.split(':')[0].substring(1),
        avatarUrl: info.avatar_url
      })
    );
  } catch (e) {
    console.error('Fetch room members error:', e);
  }
}
async function kickUser(userId) {
  if (!this.accessToken || !this.roomId || !userId) return;

  if (!confirm(`Викинути користувача ${userId} з кімнати?`)) return;

  try {
    const res = await fetch(
      `https://matrix.org/_matrix/client/r0/rooms/${encodeURIComponent(this.roomId)}/kick`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({ user_id: userId })
      }
    );

    const data = await res.json();

    if (res.ok) {
      this.roomMembers = this.roomMembers.filter(u => u.userId !== userId);
      alert(`Користувача ${userId} видалено`);
      await this.fetchRoomMembers();
    } else {
      alert('Не вдалося викинути користувача: ' + (data.error || 'Помилка'));
    }

  } catch (e) {
    alert('Помилка: ' + e.message);
  }
}
