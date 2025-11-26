"""Seed script to populate portfolio data from extracted information"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "blog_portfolio")


async def seed_portfolio():
    """Seed portfolio collection with data"""
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    portfolio_collection = db["portfolio"]
    
    # Check if portfolio already exists
    existing = await portfolio_collection.find_one({})
    if existing:
        print("⚠️  Portfolio data already exists. Skipping seed.")
        return
    
    portfolio_data = {
        "personal_info": {
            "name": "Yohans (John) Bekele",
            "role": "Software Engineer",
            "bio": "I'm a Software Engineer passionate about building scalable web applications and working with modern technologies. I enjoy experimenting with cloud infrastructure, DevOps practices, and exploring new frameworks to create efficient, user-friendly solutions.",
            "email": "yohans.Bekele@thomsonreuters.com",
            "github": "https://github.com/johnbekele",
            "linkedin": "https://www.linkedin.com/in/yohans-bekele",
            "resume_url": "/assets/resume.pdf",
            "profile_image": "/assets/profile.jpg"
        },
        "skills": [
            {
                "category": "DevOps & Cloud",
                "icon": "☁️",
                "skills": [
                    {"name": "Docker & Kubernetes", "level": 90, "description": "Container orchestration & deployment"},
                    {"name": "AWS (EC2, RDS, S3)", "level": 85, "description": "Cloud infrastructure management"},
                    {"name": "CI/CD (GitHub Actions)", "level": 90, "description": "Automated deployment pipelines"},
                    {"name": "Terraform", "level": 80, "description": "Infrastructure as Code"},
                    {"name": "Linux & Bash", "level": 95, "description": "System administration & scripting"},
                    {"name": "Nginx", "level": 85, "description": "Web server & reverse proxy"}
                ]
            },
            {
                "category": "AI & LLM",
                "icon": "🤖",
                "skills": [
                    {"name": "OpenAI GPT / Gemini AI", "level": 85, "description": "LLM integration & implementation"},
                    {"name": "LangChain", "level": 80, "description": "LLM application framework"},
                    {"name": "Vector Databases", "level": 75, "description": "Embeddings & semantic search"},
                    {"name": "RAG Architecture", "level": 80, "description": "Retrieval-augmented generation"},
                    {"name": "Python (AI/ML)", "level": 85, "description": "AI/ML development"},
                    {"name": "Prompt Engineering", "level": 90, "description": "Optimizing LLM interactions"}
                ]
            },
            {
                "category": "Development",
                "icon": "💻",
                "skills": [
                    {"name": "React / Node.js/FastAPI", "level": 95, "description": "Full-stack Web Development"},
                    {"name": "MongoDB / PostgreSQL", "level": 90, "description": "Database design & management"},
                    {"name": "REST APIs", "level": 95, "description": "API design & implementation"},
                    {"name": "Git & Version Control", "level": 95, "description": "Source control management"},
                    {"name": "Microservices", "level": 80, "description": "Distributed systems architecture"},
                    {"name": "Python / JavaScript", "level": 90, "description": "Multi-language proficiency"}
                ]
            },
            {
                "category": "Security & Tools",
                "icon": "🔒",
                "skills": [
                    {"name": "Network Security", "level": 85, "description": "Security assessment & hardening"},
                    {"name": "Nmap & Wireshark", "level": 90, "description": "Network scanning & analysis"},
                    {"name": "Metasploit", "level": 75, "description": "Penetration testing"},
                    {"name": "ServiceNow", "level": 80, "description": "IT service management"},
                    {"name": "Monitoring Tools", "level": 85, "description": "System observability"},
                    {"name": "Apache NiFi", "level": 75, "description": "Data pipeline automation"}
                ]
            }
        ],
        "projects": [
            {
                "title": "Book and Memories",
                "subtitle": "Book Sharing Social Media Platform",
                "description": "Full-stack social media app where users share book experiences and discover new reads. Integrated Gemini AI for personalized recommendations.",
                "image": "/assets/projects/bookmemo.png",
                "tech_stack": ["React", "NodeJS", "Express", "MongoDB", "AWS EC2", "Vercel", "Gemini AI", "Tailwind"],
                "demo_url": "https://book-and-memories.vercel.app/",
                "repo_url": "https://github.com/johnbekele/Book-and-Memories",
                "year": "2024",
                "impact": [
                    "Deployed on AWS EC2 with 99.5% uptime",
                    "Automated deployment via Vercel CI/CD",
                    "AI-powered book recommendations"
                ]
            },
            {
                "title": "Geez Network Scanner",
                "subtitle": "Security Assessment Tool",
                "description": "Electron-based security scanning tool for macOS with automated vulnerability detection. Terminal-style output for penetration testing workflows.",
                "image": "/assets/projects/geezos.png",
                "tech_stack": ["Electron.js", "NodeJS", "Bash", "Tailwind", "CSS"],
                "repo_url": "https://github.com/johnbekele/Geez-Offensive-Security-Scanner.git",
                "demo_url": None,
                "year": "2023",
                "impact": [
                    "Automated network reconnaissance",
                    "Cross-platform deployment",
                    "Streamlined security workflows"
                ]
            },
            {
                "title": "LawConnect",
                "subtitle": "Legal Practice Management System",
                "description": "Full-stack platform for law firms to manage client communications, scheduling, case tracking, and fee management with AI-powered legal document analysis.",
                "image": "/assets/projects/lawconnect.png",
                "tech_stack": ["React", "NodeJS", "Express", "MongoDB", "AWS EC2", "Vercel", "Gemini AI", "Tailwind"],
                "demo_url": "https://law-connect-two.vercel.app/",
                "repo_url": "https://github.com/johnbekele/LawConnect.git",
                "year": "2024",
                "impact": [
                    "Deployed on AWS with auto-scaling",
                    "Gemini AI for document analysis",
                    "Centralized legal workflow automation"
                ]
            },
            {
                "title": "WorkerDay",
                "subtitle": "Employee Management Dashboard",
                "description": "User management dashboard for tracking performance, attendance, and role-based access. Deployed on AWS infrastructure with RDS PostgreSQL.",
                "image": "/assets/projects/workerday.png",
                "tech_stack": ["React", "NodeJS", "Express", "PostgreSQL", "Sequelize", "AWS EC2", "AWS RDS", "Vercel", "Tailwind"],
                "demo_url": "https://book-and-memories.vercel.app/",
                "repo_url": "https://github.com/johnbekele/WorkerDay-Frontend.git",
                "year": "2023",
                "impact": [
                    "AWS RDS for scalable database",
                    "AWS EC2 deployment with CI/CD",
                    "Role-based access control"
                ]
            }
        ],
        "experience": []
    }
    
    result = await portfolio_collection.insert_one(portfolio_data)
    print(f"✅ Portfolio data seeded successfully! ID: {result.inserted_id}")
    
    client.close()


async def create_admin_user():
    """Create default admin user"""
    from app.utils.security import get_password_hash
    from datetime import datetime
    
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    users_collection = db["users"]
    
    # Check if admin already exists
    existing_admin = await users_collection.find_one({"email": "admin@blog.com"})
    if existing_admin:
        print("⚠️  Admin user already exists. Skipping.")
        return
    
    admin_user = {
        "username": "admin",
        "email": "admin@blog.com",
        "password": get_password_hash("admin123"),  # Change this password!
        "role": "admin",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(admin_user)
    print(f"✅ Admin user created! ID: {result.inserted_id}")
    print("📧 Email: admin@blog.com")
    print("🔑 Password: admin123 (CHANGE THIS IN PRODUCTION!)")
    
    client.close()


async def main():
    """Main seed function"""
    print("🌱 Starting database seed...")
    await seed_portfolio()
    await create_admin_user()
    print("✅ Database seed completed!")


if __name__ == "__main__":
    asyncio.run(main())

