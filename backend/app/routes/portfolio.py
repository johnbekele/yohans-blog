"""Portfolio routes"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from ..database import get_database, PORTFOLIO_COLLECTION
from ..schemas.portfolio import (
    PortfolioResponse,
    PersonalInfoResponse,
    SkillCategoryResponse,
    ProjectResponse,
    ExperienceResponse,
    PortfolioUpdate,
    PersonalInfoUpdate
)
from ..middleware.auth_middleware import get_current_admin_user
from ..schemas.auth import TokenData


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
    
    # Ensure projects have images array for backward compatibility
    if "projects" in portfolio:
        for project in portfolio["projects"]:
            # Initialize images array if it doesn't exist
            if "images" not in project:
                project["images"] = []
            
            # If images array is empty but image field exists, use it
            if (not project["images"] or len(project["images"]) == 0) and "image" in project and project["image"]:
                project["images"] = [project["image"]]
            
            # Filter out empty/null images
            if project["images"]:
                project["images"] = [img for img in project["images"] if img and str(img).strip()]
            
            # Ensure image field exists for backward compatibility (use first image)
            if project.get("images") and len(project["images"]) > 0:
                project["image"] = project["images"][0]
            elif "image" not in project:
                project["image"] = None
    
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


@router.put("", response_model=PortfolioResponse)
async def update_portfolio(
    update_data: PortfolioUpdate,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Update portfolio data (admin only)"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    # Update fields if provided
    update_dict = {}
    
    if update_data.personal_info:
        personal_info = portfolio.get("personal_info", {})
        personal_info.update({k: v for k, v in update_data.personal_info.model_dump(exclude_none=True).items()})
        update_dict["personal_info"] = personal_info
    
    if update_data.skills:
        update_dict["skills"] = [skill.model_dump() for skill in update_data.skills]
    
    if update_data.projects:
        # Ensure each project has images array and image field for backward compatibility
        projects_data = []
        for project in update_data.projects:
            project_dict = project.model_dump()
            # If images array is provided, use it; otherwise keep existing or use image field
            if not project_dict.get("images") and project_dict.get("image"):
                project_dict["images"] = [project_dict["image"]]
            # Ensure image field is set from first image for backward compatibility
            if project_dict.get("images") and len(project_dict["images"]) > 0:
                project_dict["image"] = project_dict["images"][0]
            projects_data.append(project_dict)
        update_dict["projects"] = projects_data
    
    if update_data.experience:
        update_dict["experience"] = [exp.model_dump() for exp in update_data.experience]
    
    if update_dict:
        await portfolio_collection.update_one(
            {"_id": portfolio["_id"]},
            {"$set": update_dict}
        )
    
    # Return updated portfolio
    updated = await portfolio_collection.find_one({"_id": portfolio["_id"]})
    return PortfolioResponse(**updated)


@router.put("/info", response_model=PersonalInfoResponse)
async def update_personal_info(
    update_data: PersonalInfoUpdate,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Update personal information (admin only)"""
    db = get_database()
    portfolio_collection = db[PORTFOLIO_COLLECTION]
    
    portfolio = await portfolio_collection.find_one({})
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio data not found"
        )
    
    personal_info = portfolio.get("personal_info", {})
    personal_info.update({k: v for k, v in update_data.model_dump(exclude_none=True).items()})
    
    await portfolio_collection.update_one(
        {"_id": portfolio["_id"]},
        {"$set": {"personal_info": personal_info}}
    )
    
    return PersonalInfoResponse(**personal_info)

