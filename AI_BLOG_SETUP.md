# AI Blog Generator Setup

## Backend Setup

### 1. Add TR_GPT_TOKEN to .env file

Add this line to your `/home/johanan/yohans-blog/backend/.env` file:

```env
TR_GPT_TOKEN=your_esso_token_here
```

Replace `your_esso_token_here` with your actual Thomson Reuters ESSO token.

### 2. Install httpx dependency

```bash
cd /home/johanan/yohans-blog/backend
pip install httpx==0.27.0
```

Or use the requirements.txt:
```bash
pip install -r requirements.txt
```

## How It Works

### Backend API Endpoints

1. **POST /api/ai/generate**
   - Generates a blog post based on your idea
   - Returns the generated content (doesn't publish)

2. **POST /api/ai/generate-and-post**
   - Generates a blog post AND automatically publishes it
   - Returns the post details including slug

### Frontend

1. **Navigate to Admin Dashboard** → Click "AI Generator" button
2. **Enter your idea** in the text area
3. **Click "Generate & Publish Blog Post"**
4. **Wait** for AI to generate the content (30-90 seconds)
5. **View the published post** using the link provided

## Features

✅ Automatic title generation
✅ Automatic excerpt creation
✅ Full markdown-formatted content
✅ Automatic tag suggestions
✅ Category assignment
✅ Read time calculation
✅ Automatic slug generation
✅ Instant publishing

## Example Ideas

- "Write about the differences between REST and GraphQL APIs"
- "Explain Docker containerization for beginners"
- "Compare React vs Vue.js in 2025"
- "Guide to AWS Lambda functions"
- "Introduction to Kubernetes orchestration"

## Troubleshooting

### If generation fails:
1. Check that TR_GPT_TOKEN is correctly set in .env
2. Verify the token is valid (not expired)
3. Check backend logs for detailed error messages
4. Ensure httpx is installed (`pip list | grep httpx`)

### If post doesn't appear:
1. Refresh the blog page
2. Check admin dashboard for the new post
3. Verify the post was marked as `published: true`

## Environment Variable

**Variable Name**: `TR_GPT_TOKEN`
**Location**: `/home/johanan/yohans-blog/backend/.env`
**Format**: Just paste your ESSO token (no quotes needed if it's a simple string)

Example:
```env
TR_GPT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

