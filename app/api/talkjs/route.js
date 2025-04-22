export async function POST(req) {
    const { currentUser, otherUser } = await req.json();
  
    const secret = 'sk_test_SX6QBNWYd0AP0uUgc4ie00fL7mKdqh3s';
    const appId = 'tUsjNDdJ';
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    };
  
    try {
      // Create or update users
      await fetch(`https://api.talkjs.com/v1/${appId}/users/${currentUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(currentUser),
      });
  
      await fetch(`https://api.talkjs.com/v1/${appId}/users/${otherUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(otherUser),
      });
  
      // Create conversation
      const conversationId = `${currentUser.id}_${otherUser.id}`;
      await fetch(`https://api.talkjs.com/v1/${appId}/conversations/${conversationId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          participants: [currentUser.id, otherUser.id],
        }),
      });
  
      return new Response(JSON.stringify({ conversationId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('TalkJS API error:', err);
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  