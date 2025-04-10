// This file should be deployed to Cloudflare Workers

// In-memory store for comments (in production, use KV or D1 database)
let comments = [];

// Function to handle OPTIONS requests (CORS preflight)
function handleOptions(request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

// Handle GET and POST requests
async function handleRequest(request) {
  // Add CORS headers to all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle OPTIONS request
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  const url = new URL(request.url);
  
  // GET /comments - Return list of comments
  if (request.method === "GET" && url.pathname === "/comments") {
    return new Response(JSON.stringify(comments), {
      headers
    });
  }
  
  // POST /comments - Add a new comment
  if (request.method === "POST" && url.pathname === "/comments") {
    try {
      const newComment = await request.json();
      
      // Simple validation
      if (!newComment.name || !newComment.comment) {
        return new Response(JSON.stringify({ error: "Name and comment are required" }), {
          status: 400,
          headers
        });
      }
      
      // In production, you would sanitize input here
      
      // Add timestamp if not provided
      if (!newComment.timestamp) {
        newComment.timestamp = new Date().toISOString();
      }
      
      // Add to comments array (in production, store in KV or D1)
      comments.unshift(newComment);
      
      // Keep only the latest 100 comments
      if (comments.length > 100) {
        comments = comments.slice(0, 100);
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers
      });
    }
  }
  
  // Return 404 for other requests
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers
  });
}

// Register the worker
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});