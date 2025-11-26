"""Portfolio model"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic"""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class PersonalInfo(BaseModel):
    """Personal information"""
    name: str
    role: str
    bio: str
    email: str
    github: str
    linkedin: str
    resume_url: Optional[str] = None
    profile_image: Optional[str] = None


class SkillItem(BaseModel):
    """Individual skill"""
    name: str
    level: int
    description: str


class SkillCategory(BaseModel):
    """Skill category"""
    category: str
    icon: str
    skills: List[SkillItem]


class Project(BaseModel):
    """Portfolio project"""
    title: str
    subtitle: str
    description: str
    image: Optional[str] = None
    tech_stack: List[str]
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    year: str
    impact: List[str]


class Experience(BaseModel):
    """Work experience"""
    company: str
    role: str
    type: str
    duration: str
    location: str
    description: str
    achievements: List[str]
    technologies: List[str]


class PortfolioModel(BaseModel):
    """Portfolio database model"""
    
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    personal_info: PersonalInfo
    skills: List[SkillCategory]
    projects: List[Project]
    experience: List[Experience]
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

