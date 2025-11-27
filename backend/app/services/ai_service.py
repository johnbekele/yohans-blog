"""AI Service for blog post generation"""
import httpx
from typing import Optional, List, Dict
from ..config import settings

TR_API_BASE = "https://aiopenarena.gcs.int.thomsonreuters.com"


async def validate_token(token: str) -> Dict:
    """
    Validate Open Arena ESSO token by calling GET /v1/user endpoint
    
    Returns:
        dict with 'valid' (bool) and 'error' (str if invalid)
    """
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TR_API_BASE}/v1/user",
                headers=headers
            )
            
            if response.status_code == 200:
                return {"valid": True, "data": response.json()}
            elif response.status_code == 401:
                return {"valid": False, "error": "Token is expired or invalid"}
            else:
                return {"valid": False, "error": f"Token validation failed: {response.status_code}"}
                
    except httpx.TimeoutException:
        return {"valid": False, "error": "Token validation request timed out"}
    except Exception as e:
        return {"valid": False, "error": f"Error validating token: {str(e)}"}


async def validate_and_fix_images(featured_image: Optional[str], images: List[str], topic: str) -> tuple:
    """
    Validate image URLs and generate fallback images if they return 404
    
    Args:
        featured_image: Main image URL
        images: List of additional image URLs
        topic: Blog topic for generating relevant fallback images
        
    Returns:
        tuple: (validated_featured_image, validated_images_list)
    """
    # Generate fallback images using Unsplash Source API
    def generate_fallback_image(query: str, width: int = 1200, height: int = 600, index: int = 0) -> str:
        """Generate a fallback image URL from Unsplash Source"""
        # Unsplash Source provides random images by keyword
        # Clean the query for URL
        clean_query = query.replace(" ", "-").lower()[:50]
        return f"https://source.unsplash.com/{width}x{height}/?{clean_query}&sig={index}"
    
    async def check_image_url(url: str) -> bool:
        """Check if image URL is accessible"""
        if not url:
            return False
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.head(url, follow_redirects=True)
                return response.status_code == 200
        except:
            return False
    
    # Validate featured image
    validated_featured = featured_image
    if featured_image:
        is_valid = await check_image_url(featured_image)
        if not is_valid:
            # Only log in debug mode
            import os
            if os.getenv("DEBUG", "False").lower() == "true":
                print("⚠️ Featured image not accessible, generating fallback...")
            validated_featured = generate_fallback_image(topic, 1200, 600, 0)
    else:
        # No featured image provided, generate one
        validated_featured = generate_fallback_image(topic, 1200, 600, 0)
    
    # Validate additional images
    validated_images = []
    for idx, img_url in enumerate(images):
        is_valid = await check_image_url(img_url)
        if is_valid:
            validated_images.append(img_url)
        else:
            # Only log in debug mode
            import os
            if os.getenv("DEBUG", "False").lower() == "true":
                print(f"⚠️ Image {idx+1} not accessible, generating fallback...")
            validated_images.append(generate_fallback_image(topic, 800, 600, idx + 1))
    
    # If no images provided, generate 2-3 default ones
    if not validated_images:
        validated_images = [
            generate_fallback_image(topic, 800, 600, 1),
            generate_fallback_image(topic, 800, 600, 2),
        ]
    
    return validated_featured, validated_images


class AIBlogGenerator:
    """Service to generate blog posts using Thomson Reuters GPT API"""
    
    def __init__(self):
        self.api_url = "https://aiopenarena.gcs.int.thomsonreuters.com/v1/inference"
        self.workflow_id = "80f448d2-fd59-440f-ba24-ebc3014e1fdf"
    
    async def generate_blog_post(self, user_idea: str, token: str) -> dict:
        """
        Generate a blog post from user's idea
        
        Args:
            user_idea: The topic or idea for the blog post
            token: Open Arena ESSO token for authentication
            
        Returns:
            dict with generated blog content
        """
        if not token:
            raise ValueError("Open Arena ESSO token is required")
        
        # Create a detailed prompt for blog generation
        prompt = f"""Write a blog post about: {user_idea}

WRITING STYLE:
- Write like you're explaining to a friend over coffee ☕
- Use "I", "you", "we" - make it personal and conversational
- Keep it SHORT and SNAPPY - break up long paragraphs
- Use everyday language, not corporate jargon
- Add personality - share opinions, experiences, hot takes
- Throw in some humor or relatable examples
- Use emojis sparingly but naturally
- Keep sentences short and punchy
- Talk like a real human, not a textbook

STRUCTURE:
- Start with a hook or personal story
- Use short paragraphs (2-3 lines max)
- Add subheadings to break it up
- Include bullet points for easy scanning
- End with a personal thought or question for readers
- Length: 400-600 words (readable in 3-4 minutes) - KEEP IT SHORT!

TONE EXAMPLES:
❌ "Organizations should consider implementing containerization..."
✅ "Honestly? Docker changed how I deploy apps. Let me tell you why..."

❌ "It is recommended to utilize best practices..."
✅ "Here's what I learned the hard way..."

CONTENT TO INCLUDE:
- Personal experiences or observations
- Real-world examples (not theoretical)
- Quick tips or lessons learned
- Code examples if relevant (but keep them simple!)
- Your actual opinion - what do YOU think?

Format as JSON:
{{
  "title": "Catchy, conversational title (not formal)",
  "excerpt": "Hook them in 2 sentences - make them want to read more",
  "content": "Full blog post in markdown - personal, short paragraphs, engaging",
  "tags": "tag1, tag2, tag3",
  "category": "category",
  "featured_image": "https://images.unsplash.com/photo-...",
  "images": ["url1", "url2"]
}}

Write as Yohans (John) - a Software Engineer who loves tech but keeps it real."""

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # According to Open Arena API documentation
        payload = {
            "workflow_id": self.workflow_id,
            "query": prompt,
            "is_persistence_allowed": False,
            "modelparams": {
                "openai_gpt-4-turbo": {
                    "system_prompt": "You are Yohans (John) Bekele, a Software Engineer who writes casual, personal tech blogs. Write like you're talking to a friend - conversational, short paragraphs, personal experiences, real opinions. Keep it SHORT (400-600 words max), engaging and easy to read. Use 'I', 'you', 'we'. No corporate jargon. Be human. Get to the point quickly.",
                    "temperature": "0.8",
                    "max_tokens": "2000"
                }
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    self.api_url,
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                
                data = response.json()
                
                # Extract the AI response from TR GPT API according to documentation
                # Response structure: result.answer["openai_gpt-4-turbo"]
                result = data.get("result", {})
                answer = result.get("answer", {})
                ai_response = answer.get("openai_gpt-4-turbo", "")
                
                if not ai_response:
                    return {
                        "success": False,
                        "error": "No response from AI"
                    }
                
                # Try to parse as JSON if it looks like JSON
                import json
                try:
                    # Find JSON in the response
                    if "{" in ai_response and "}" in ai_response:
                        start = ai_response.find("{")
                        end = ai_response.rfind("}") + 1
                        json_str = ai_response[start:end]
                        blog_data = json.loads(json_str)
                        
                        # Handle tags properly - can be string, list, or missing
                        tags_raw = blog_data.get("tags", "AI Generated,Blog")
                        if isinstance(tags_raw, str):
                            tags = [t.strip() for t in tags_raw.split(",") if t.strip()]
                        elif isinstance(tags_raw, list):
                            tags = [str(t).strip() for t in tags_raw if str(t).strip()]
                        else:
                            tags = ["AI Generated", "Blog"]
                        
                        # Handle images - can be string, list, or missing
                        images_raw = blog_data.get("images", [])
                        if isinstance(images_raw, str):
                            images = [img.strip() for img in images_raw.split(",") if img.strip()]
                        elif isinstance(images_raw, list):
                            images = [str(img).strip() for img in images_raw if str(img).strip()]
                        else:
                            images = []
                        
                        # Validate and fix images
                        featured_image = blog_data.get("featured_image", None)
                        validated_featured, validated_images = await validate_and_fix_images(
                            featured_image, 
                            images, 
                            user_idea
                        )
                        
                        return {
                            "success": True,
                            "title": blog_data.get("title", "Untitled Blog Post"),
                            "excerpt": blog_data.get("excerpt", ""),
                            "content": blog_data.get("content", ai_response),
                            "tags": tags,
                            "category": blog_data.get("category", "general"),
                            "featured_image": validated_featured,
                            "images": validated_images
                        }
                except json.JSONDecodeError:
                    pass
                
                # Fallback: return raw response as content
                excerpt = ai_response[:200] + "..." if len(ai_response) > 200 else ai_response
                
                # Generate fallback images
                featured_image, images = await validate_and_fix_images(None, [], user_idea)
                
                return {
                    "success": True,
                    "title": f"Blog Post: {user_idea[:50]}",
                    "excerpt": excerpt,
                    "content": ai_response,
                    "tags": ["AI Generated", "Blog"],
                    "category": "general",
                    "featured_image": featured_image,
                    "images": images
                }
                
        except httpx.HTTPError as e:
            return {
                "success": False,
                "error": f"API request failed: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error generating blog post: {str(e)}"
            }


# Singleton instance
ai_blog_generator = AIBlogGenerator()

