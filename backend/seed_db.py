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
            "role": "Application Support Analyst + Freelance Web Developer",
            "bio": "I work as an Application Support Analyst maintaining production systems while freelancing as a web developer. I'm passionate about experimenting with LLMs—building API integrations, exploring agent architectures, vector databases, and RAG chains. I use Docker, AWS, Kubernetes for deployments and GitHub Actions with Datadog for monitoring, with a strong foundation in infrastructure development.",
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
        "experience": [
            {
                "company": "Thomson Reuters",
                "role": "Product Application Support Specialist",
                "type": "DevOps & Application Support",
                "duration": "August 2024 – Present",
                "location": "Hybrid Work",
                "description": "Orchestrate end-to-end environment setup and provide expert DevOps support for enterprise deployments.",
                "achievements": [
                    "Set up Microsoft SQL Server clusters with 99.9% uptime",
                    "Automated infrastructure provisioning reducing setup time by 60%",
                    "Optimized database performance queries improving response time by 40%",
                    "Implemented monitoring solutions detecting incidents 50% faster"
                ],
                "technologies": ["SQL Server", "Windows Server", "Network Provisioning", "Infrastructure Management", "Monitoring"]
            },
            {
                "company": "State Street",
                "role": "Financial Analyst",
                "type": "Automation & Data Engineering",
                "duration": "March 2023 – July 2024",
                "location": "Hybrid",
                "description": "Specialized in process automation and technical reporting to support financial operations.",
                "achievements": [
                    "Automated monthly reports reducing processing time from 8hrs to 30min",
                    "Built VBA macros automating 70% of repetitive Excel workflows",
                    "Created technical dashboards used by 100+ team members daily",
                    "Reduced manual data errors by 85% through automation scripts"
                ],
                "technologies": ["Excel VBA", "VS Code", "Python", "Automation", "Data Visualization"]
            },
            {
                "company": "Cisco",
                "role": "Data Analyst",
                "type": "Data Pipeline & ETL Engineering",
                "duration": "August 2022 – February 2023",
                "location": "Remote",
                "description": "Delivered automation and data pipeline engineering for large-scale MSSP migration projects.",
                "achievements": [
                    "Built Apache NiFi pipelines processing 1M+ records daily",
                    "Created Python automation reducing manual data cleansing by 70%",
                    "Developed SQL ETL scripts migrating 5TB+ data with 99.9% accuracy",
                    "Reduced data validation time by 30% through Bash automation"
                ],
                "technologies": ["Apache NiFi", "Python", "SQL", "Bash", "Oracle", "MySQL", "ETL"]
            },
            {
                "company": "Infosys",
                "role": "Senior Process Executive",
                "type": "Application Performance & Monitoring",
                "duration": "March 2022 – April 2023",
                "location": "Remote",
                "description": "Monitored application performance and automated operations for health suite platforms.",
                "achievements": [
                    "Achieved 99.8% application uptime through proactive monitoring",
                    "Automated daily monitoring tasks saving 15hrs/week team time",
                    "Implemented New Relic dashboards reducing MTTR by 45%",
                    "Created automated alerting reducing incident response time by 50%"
                ],
                "technologies": ["New Relic", "ServiceNow", "JIRA", "JavaScript", "Python", "SQL"]
            },
            {
                "company": "Commercial Bank of Ethiopia",
                "role": "Data Analytics Engineer",
                "type": "Analytics & Compliance",
                "duration": "Feb 2017 – Jan 2019",
                "location": "On-site",
                "description": "Led KYC data analysis and built compliance reporting systems for risk monitoring.",
                "achievements": [
                    "Built Tableau dashboards monitoring 500K+ customer accounts",
                    "Automated KYC validation reducing review time by 60%",
                    "Created SQL reports supporting compliance audits with 100% accuracy",
                    "Developed analytics reducing flagged account review time by 40%"
                ],
                "technologies": ["SQL", "Tableau", "Power BI", "VS Code", "Data Analytics"]
            }
        ]
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

