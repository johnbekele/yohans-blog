"""Portfolio schemas"""
from pydantic import BaseModel
from typing import List, Optional


class PersonalInfoResponse(BaseModel):
    """Personal information response"""
    name: str
    role: str
    bio: str
    email: str
    github: str
    linkedin: str
    resume_url: Optional[str]
    profile_image: Optional[str]


class SkillItemResponse(BaseModel):
    """Skill item response"""
    name: str
    level: int
    description: str


class SkillCategoryResponse(BaseModel):
    """Skill category response"""
    category: str
    icon: str
    skills: List[SkillItemResponse]


class ProjectResponse(BaseModel):
    """Project response"""
    title: str
    subtitle: str
    description: str
    image: Optional[str]
    tech_stack: List[str]
    demo_url: Optional[str]
    repo_url: Optional[str]
    year: str
    impact: List[str]


class ExperienceResponse(BaseModel):
    """Experience response"""
    company: str
    role: str
    type: str
    duration: str
    location: str
    description: str
    achievements: List[str]
    technologies: List[str]


class PortfolioResponse(BaseModel):
    """Complete portfolio response"""
    personal_info: PersonalInfoResponse
    skills: List[SkillCategoryResponse]
    projects: List[ProjectResponse]
    experience: List[ExperienceResponse]

