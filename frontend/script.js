// Example: fetch XP data
fetch('/add-xp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user1', xpGain: 10 })
})
.then(res => res.json())
.then(data => console.log(data));