"""Portfolio routes"""
from fastapi import APIRouter, HTTPException, status
from typing import List

from ..database import get_database, PORTFOLIO_COLLECTION
from ..schemas.portfolio import (
    PortfolioResponse,
    PersonalInfoResponse,
    SkillCategoryResponse,
    ProjectResponse,
    ExperienceResponse
)


router = APIRouter()


@router.get("", response_model=PortfolioResponse)
async def get_portfolio():
    """Get complete portfolio data"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    return PortfolioResponse(**portfolio)


@router.get("/info", response_model=PersonalInfoResponse)
async def get_personal_info():
    """Get personal information"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    return PersonalInfoResponse(**portfolio["personal_info"])


@router.get("/skills", response_model=List[SkillCategoryResponse])
async def get_skills():
    """Get all skills"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    return [SkillCategoryResponse(**skill) for skill in portfolio["skills"]]


@router.get("/projects", response_model=List[ProjectResponse])
async def get_projects():
    """Get all projects"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    return [ProjectResponse(**project) for project in portfolio["projects"]]


@router.get("/experience", response_model=List[ExperienceResponse])
async def get_experience():
    """Get work experience"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    return [ExperienceResponse(**exp) for exp in portfolio["experience"]]

