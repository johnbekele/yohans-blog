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


class PersonalInfoUpdate(BaseModel):
    """Personal information update"""
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    resume_url: Optional[str] = None
    profile_image: Optional[str] = None


class SkillItemResponse(BaseModel):
    """Skill item response"""
    name: str
    level: int
    description: str


class SkillItemUpdate(BaseModel):
    """Skill item update"""
    name: str
    level: int
    description: str


class SkillCategoryResponse(BaseModel):
    """Skill category response"""
    category: str
    icon: str
    skills: List[SkillItemResponse]


class SkillCategoryUpdate(BaseModel):
    """Skill category update"""
    category: str
    icon: str
    skills: List[SkillItemUpdate]


class ProjectResponse(BaseModel):
    """Project response"""
    title: str
    subtitle: str
    description: str
    image: Optional[str] = None  # Keep for backward compatibility
    images: List[str] = []  # Multiple images
    tech_stack: List[str]
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    year: str
    impact: List[str]
    featured: Optional[bool] = False


class ProjectUpdate(BaseModel):
    """Project update"""
    title: str
    subtitle: str
    description: str
    image: Optional[str] = None  # Keep for backward compatibility
    images: Optional[List[str]] = []  # Multiple images
    tech_stack: List[str]
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    year: str
    impact: List[str]
    featured: Optional[bool] = False


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


class FooterInfo(BaseModel):
    """Footer information"""
    name: str
    about_text: str
    contact_text: str
    contact_button_text: str
    contact_link: str
    logo_text: Optional[str] = None
    logo_image: Optional[str] = None


class FooterInfoUpdate(BaseModel):
    """Footer information update"""
    name: Optional[str] = None
    about_text: Optional[str] = None
    contact_text: Optional[str] = None
    contact_button_text: Optional[str] = None
    contact_link: Optional[str] = None
    logo_text: Optional[str] = None
    logo_image: Optional[str] = None


class PortfolioResponse(BaseModel):
    """Complete portfolio response"""
    personal_info: PersonalInfoResponse
    skills: List[SkillCategoryResponse]
    projects: List[ProjectResponse]
    experience: List[ExperienceResponse]
    footer: Optional[FooterInfo] = None


class PortfolioUpdate(BaseModel):
    """Portfolio update"""
    personal_info: Optional[PersonalInfoUpdate] = None
    skills: Optional[List[SkillCategoryUpdate]] = None
    projects: Optional[List[ProjectUpdate]] = None
    experience: Optional[List[ExperienceResponse]] = None
    footer: Optional[FooterInfoUpdate] = None
