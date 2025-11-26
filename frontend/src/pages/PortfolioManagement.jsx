import { useState, useEffect } from 'react'
import { getPortfolio, updatePortfolio } from '../services/portfolioService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave, faPlus, faTrash, faEdit, faSpinner,
  faBriefcase, faCode, faLink, faImage, faStar,
  faUpload, faTimes
} from '@fortawesome/free-solid-svg-icons'

const PortfolioManagement = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('about') // about, skills, projects, links
  const [portfolio, setPortfolio] = useState(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio()
      setPortfolio(data)
    } catch (err) {
      setError('Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updateData) => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updatePortfolio(updateData)
      await fetchPortfolio() // Refresh data
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save portfolio')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!portfolio) {
    return <div className="text-text-secondary">Portfolio data not available</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-accent-cyan/20">
        <button
          onClick={() => setActiveTab('about')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'about'
              ? 'border-accent-cyan text-accent-cyan'
              : 'border-transparent text-text-secondary hover:text-accent-cyan'
          }`}
        >
          About Me
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'skills'
              ? 'border-accent-cyan text-accent-cyan'
              : 'border-transparent text-text-secondary hover:text-accent-cyan'
          }`}
        >
          Skills & Technology
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'projects'
              ? 'border-accent-cyan text-accent-cyan'
              : 'border-transparent text-text-secondary hover:text-accent-cyan'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'links'
              ? 'border-accent-cyan text-accent-cyan'
              : 'border-transparent text-text-secondary hover:text-accent-cyan'
          }`}
        >
          Links
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && (
        <AboutMeTab portfolio={portfolio} onSave={handleSave} saving={saving} />
      )}
      {activeTab === 'skills' && (
        <SkillsTab portfolio={portfolio} onSave={handleSave} saving={saving} />
      )}
      {activeTab === 'projects' && (
        <ProjectsTab portfolio={portfolio} onSave={handleSave} saving={saving} />
      )}
      {activeTab === 'links' && (
        <LinksTab portfolio={portfolio} onSave={handleSave} saving={saving} />
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400">Portfolio updated successfully!</p>
        </div>
      )}
    </div>
  )
}

// About Me Tab
const AboutMeTab = ({ portfolio, onSave, saving }) => {
  const [bio, setBio] = useState(portfolio.personal_info.bio)

  const handleSave = () => {
    onSave({
      personal_info: {
        bio: bio
      }
    })
  }

  return (
    <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
      <h2 className="text-2xl font-bold text-text-primary mb-6">About Me</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Bio / About Me
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="8"
            className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
            placeholder="Write about yourself..."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Skills Tab
const SkillsTab = ({ portfolio, onSave, saving }) => {
  const [skills, setSkills] = useState(portfolio.skills)

  const handleSave = () => {
    onSave({ skills })
  }

  const updateCategoryIcon = (index, icon) => {
    const updated = [...skills]
    updated[index].icon = icon
    setSkills(updated)
  }

  const updateSkillLevel = (categoryIndex, skillIndex, level) => {
    const updated = [...skills]
    updated[categoryIndex].skills[skillIndex].level = parseInt(level)
    setSkills(updated)
  }

  const addSkill = (categoryIndex) => {
    const updated = [...skills]
    updated[categoryIndex].skills.push({
      name: 'New Skill',
      level: 50,
      description: ''
    })
    setSkills(updated)
  }

  const removeSkill = (categoryIndex, skillIndex) => {
    const updated = [...skills]
    updated[categoryIndex].skills.splice(skillIndex, 1)
    setSkills(updated)
  }

  const addCategory = () => {
    setSkills([...skills, {
      category: 'New Category',
      icon: '⭐',
      skills: []
    }])
  }

  return (
    <div className="space-y-6">
      <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Skills & Technology</h2>
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Category
          </button>
        </div>

        {skills.map((category, catIndex) => (
          <div key={catIndex} className="mb-8 p-4 bg-bg-secondary rounded-lg border border-accent-cyan/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={category.category}
                  onChange={(e) => {
                    const updated = [...skills]
                    updated[catIndex].category = e.target.value
                    setSkills(updated)
                  }}
                  className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={category.icon}
                  onChange={(e) => updateCategoryIcon(catIndex, e.target.value)}
                  maxLength={2}
                  className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary text-2xl text-center"
                  placeholder="☁️"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => addSkill(catIndex)}
                  className="w-full px-4 py-2 bg-accent-lime/10 text-accent-lime rounded-lg hover:bg-accent-lime/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Skill
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="p-4 bg-bg-primary rounded-lg border border-accent-cyan/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Skill Name</label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const updated = [...skills]
                          updated[catIndex].skills[skillIndex].name = e.target.value
                          setSkills(updated)
                        }}
                        className="w-full px-3 py-2 bg-bg-secondary border border-accent-cyan/20 rounded-lg text-text-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Level: {skill.level}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateSkillLevel(catIndex, skillIndex, e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeSkill(catIndex, skillIndex)}
                        className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                    <input
                      type="text"
                      value={skill.description}
                      onChange={(e) => {
                        const updated = [...skills]
                        updated[catIndex].skills[skillIndex].description = e.target.value
                        setSkills(updated)
                      }}
                      className="w-full px-3 py-2 bg-bg-secondary border border-accent-cyan/20 rounded-lg text-text-primary text-sm"
                      placeholder="Brief description..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Saving Skills...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              <span>Save All Skills</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Projects Tab
const ProjectsTab = ({ portfolio, onSave, saving }) => {
  const [projects, setProjects] = useState(() => {
    // Initialize projects with imageMode and uploadedImages
    return (portfolio.projects || []).map(project => ({
      ...project,
      imageMode: project.imageMode || 'link',
      uploadedImages: project.uploadedImages || [],
      currentLink: ''
    }))
  })
  const [activePasteBox, setActivePasteBox] = useState(null) // { projectIndex, boxIndex }

  // Handle paste events and Escape key
  useEffect(() => {
    const handlePaste = async (e) => {
      if (!activePasteBox) return

      const { projectIndex, boxIndex } = activePasteBox
      const items = e.clipboardData?.items

      if (!items) return

      // Find image in clipboard
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault()
          const blob = items[i].getAsFile()
          
          if (blob) {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64String = reader.result
              const updated = [...projects]
              if (!updated[projectIndex].uploadedImages) {
                updated[projectIndex].uploadedImages = []
              }
              // Replace or add at this index
              updated[projectIndex].uploadedImages[boxIndex] = base64String
              // Update images array with base64
              const allImages = [
                ...(updated[projectIndex].images || []).filter(img => !img.startsWith('data:image')),
                ...updated[projectIndex].uploadedImages.filter(img => img)
              ]
              updated[projectIndex].images = allImages
              if (!updated[projectIndex].image && allImages.length > 0) {
                updated[projectIndex].image = allImages[0]
              }
              setProjects(updated)
              // Stop listening after paste
              setActivePasteBox(null)
            }
            reader.readAsDataURL(blob)
          }
          break
        }
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activePasteBox) {
        setActivePasteBox(null)
      }
    }

    if (activePasteBox) {
      window.addEventListener('paste', handlePaste)
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('paste', handlePaste)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [activePasteBox, projects])

  const handleSave = () => {
    // Ensure each project has images array and image field for backward compatibility
    // Remove frontend-only fields (imageMode, uploadedImages, currentLink) before saving
    const projectsToSave = projects.map(project => {
      const { imageMode, uploadedImages, currentLink, ...projectData } = project
      return {
        ...projectData,
        images: project.images || (project.image ? [project.image] : []),
        image: project.images && project.images.length > 0 ? project.images[0] : (project.image || null)
      }
    })
    onSave({ projects: projectsToSave })
  }

  const addProject = () => {
    setProjects([...projects, {
      title: 'New Project',
      subtitle: 'Project Subtitle',
      description: '',
      image: '',
      images: [],
      imageMode: 'link',
      uploadedImages: [],
      currentLink: '',
      tech_stack: [],
      demo_url: '',
      repo_url: '',
      year: new Date().getFullYear().toString(),
      impact: [],
      featured: false
    }])
  }

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const updateProject = (index, field, value) => {
    const updated = [...projects]
    updated[index][field] = value
    // Ensure images array exists
    if (!updated[index].images) {
      updated[index].images = []
    }
    setProjects(updated)
  }

  return (
    <div className="space-y-6">
      <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Projects</h2>
          <button
            onClick={addProject}
            className="px-4 py-2 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Project
          </button>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="p-6 bg-bg-secondary rounded-lg border border-accent-cyan/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={project.featured || false}
                    onChange={(e) => updateProject(index, 'featured', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-medium text-text-primary">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-400" />
                    Featured
                  </label>
                </div>
                <button
                  onClick={() => removeProject(index)}
                  className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={project.subtitle}
                    onChange={(e) => updateProject(index, 'subtitle', e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Project Images
                </label>
                
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...projects]
                      updated[index].imageMode = 'link'
                      setProjects(updated)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (project.imageMode || 'link') === 'link'
                        ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                        : 'bg-bg-secondary text-text-secondary border border-accent-cyan/10 hover:bg-bg-primary'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...projects]
                      updated[index].imageMode = 'upload'
                      setProjects(updated)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      project.imageMode === 'upload'
                        ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                        : 'bg-bg-secondary text-text-secondary border border-accent-cyan/10 hover:bg-bg-primary'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload
                  </button>
                </div>

                {/* Link Mode */}
                {(project.imageMode || 'link') === 'link' && (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={project.currentLink || ''}
                        onChange={(e) => {
                          const updated = [...projects]
                          updated[index].currentLink = e.target.value
                          setProjects(updated)
                        }}
                        placeholder="Enter image URL"
                        className="flex-1 px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary font-mono text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const link = project.currentLink?.trim()
                            if (link) {
                              const updated = [...projects]
                              const currentImages = updated[index].images || []
                              updated[index].images = [...currentImages, link]
                              updated[index].currentLink = ''
                              if (!updated[index].image) {
                                updated[index].image = link
                              }
                              setProjects(updated)
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const link = project.currentLink?.trim()
                          if (link) {
                            const updated = [...projects]
                            const currentImages = updated[index].images || []
                            updated[index].images = [...currentImages, link]
                            updated[index].currentLink = ''
                            if (!updated[index].image) {
                              updated[index].image = link
                            }
                            setProjects(updated)
                          }
                        }}
                        className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 rounded-lg hover:bg-accent-cyan/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Link
                      </button>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">
                      Enter an image URL and click "Add Link" to add it to the project.
                    </p>
                  </div>
                )}

                {/* Upload Mode */}
                {project.imageMode === 'upload' && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {(() => {
                        // Show at least 4 boxes, or more if there are uploaded images
                        const numBoxes = Math.max(4, project.uploadedImages ? project.uploadedImages.length : 0)
                        return Array.from({ length: numBoxes }, (_, i) => i)
                      })().map((boxIdx) => {
                        const hasImage = project.uploadedImages && project.uploadedImages[boxIdx]
                        
                        const isActivePasteBox = activePasteBox?.projectIndex === index && activePasteBox?.boxIndex === boxIdx
                        
                        return (
                          <div key={boxIdx} className="relative">
                            <label 
                              className={`block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-bg-secondary flex items-center justify-center ${
                                isActivePasteBox
                                  ? 'border-accent-cyan border-solid bg-accent-cyan/10 shadow-lg shadow-accent-cyan/20'
                                  : hasImage
                                  ? 'border-accent-cyan/30 hover:border-accent-cyan/50'
                                  : 'border-accent-cyan/30 hover:border-accent-cyan/50'
                              }`}
                              onClick={(e) => {
                                if (!hasImage) {
                                  e.preventDefault()
                                  setActivePasteBox({ projectIndex: index, boxIndex: boxIdx })
                                }
                              }}
                            >
                              {hasImage ? (
                                <img
                                  src={project.uploadedImages[boxIdx]}
                                  alt={`Upload ${boxIdx + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-center p-2">
                                  {isActivePasteBox ? (
                                    <>
                                      <FontAwesomeIcon icon={faUpload} className="text-2xl text-accent-cyan mb-1 animate-pulse" />
                                      <p className="text-xs text-accent-cyan font-medium">Paste Image (Ctrl+V)</p>
                                    </>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon icon={faUpload} className="text-2xl text-text-secondary mb-1" />
                                      <p className="text-xs text-text-secondary">Click to Upload or Paste</p>
                                    </>
                                  )}
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                      const base64String = reader.result
                                      const updated = [...projects]
                                      if (!updated[index].uploadedImages) {
                                        updated[index].uploadedImages = []
                                      }
                                      // Replace or add at this index
                                      updated[index].uploadedImages[boxIdx] = base64String
                                      // Update images array with base64
                                      const allImages = [
                                        ...(updated[index].images || []).filter(img => !img.startsWith('data:image')),
                                        ...updated[index].uploadedImages.filter(img => img)
                                      ]
                                      updated[index].images = allImages
                                      if (!updated[index].image && allImages.length > 0) {
                                        updated[index].image = allImages[0]
                                      }
                                      setProjects(updated)
                                      // Stop listening after upload
                                      setActivePasteBox(null)
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                              />
                            </label>
                            {hasImage && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...projects]
                                  // Remove the image at this box index
                                  const imageToRemove = updated[index].uploadedImages[boxIdx]
                                  updated[index].uploadedImages[boxIdx] = null
                                  // Remove from images array
                                  updated[index].images = (updated[index].images || []).filter(img => img !== imageToRemove)
                                  if (updated[index].images.length > 0) {
                                    updated[index].image = updated[index].images[0]
                                  } else {
                                    updated[index].image = null
                                  }
                                  setProjects(updated)
                                }}
                                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...projects]
                        if (!updated[index].uploadedImages) {
                          updated[index].uploadedImages = []
                        }
                        // Add 4 more empty slots
                        updated[index].uploadedImages = [...updated[index].uploadedImages, null, null, null, null]
                        setProjects(updated)
                      }}
                      className="px-4 py-2 bg-bg-secondary text-text-secondary border border-accent-cyan/20 rounded-lg hover:bg-bg-primary transition-colors text-sm"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Add More Upload Boxes
                    </button>
                    <p className="text-xs text-text-secondary mt-2">
                      Upload images directly or click a box and paste (Ctrl+V). Images will be stored as base64 data URLs.
                    </p>
                    {activePasteBox && activePasteBox.projectIndex === index && (
                      <p className="text-xs text-accent-cyan mt-1 animate-pulse">
                        ✓ Box {activePasteBox.boxIndex + 1} is listening for paste (Ctrl+V)
                      </p>
                    )}
                  </div>
                )}

                {/* Image Previews */}
                {project.images && project.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-text-primary mb-2">Image Previews:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {project.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative">
                          <img 
                            src={img} 
                            alt={`Preview ${imgIdx + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border border-accent-cyan/20"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...projects]
                              updated[index].images = updated[index].images.filter((_, i) => i !== imgIdx)
                              // Also remove from uploadedImages if it's a base64 image
                              if (img.startsWith('data:image') && updated[index].uploadedImages) {
                                updated[index].uploadedImages = updated[index].uploadedImages.filter(uploadedImg => uploadedImg !== img)
                              }
                              if (updated[index].images.length > 0) {
                                updated[index].image = updated[index].images[0]
                              } else {
                                updated[index].image = null
                              }
                              setProjects(updated)
                            }}
                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={project.demo_url || ''}
                    onChange={(e) => updateProject(index, 'demo_url', e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <FontAwesomeIcon icon={faCode} className="mr-2" />
                    Repo URL
                  </label>
                  <input
                    type="url"
                    value={project.repo_url || ''}
                    onChange={(e) => updateProject(index, 'repo_url', e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack}
                  onChange={(e) => updateProject(index, 'tech_stack', e.target.value.split(',').map(t => t.trim()))}
                  className="w-full px-4 py-2 bg-bg-primary border border-accent-cyan/20 rounded-lg text-text-primary"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Saving Projects...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              <span>Save All Projects</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Links Tab
const LinksTab = ({ portfolio, onSave, saving }) => {
  const [personalInfo, setPersonalInfo] = useState(portfolio.personal_info)

  const handleSave = () => {
    onSave({ personal_info: personalInfo })
  }

  return (
    <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Social Links</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            GitHub URL
          </label>
          <input
            type="url"
            value={personalInfo.github}
            onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
            className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            LinkedIn URL
          </label>
          <input
            type="url"
            value={personalInfo.linkedin}
            onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
            className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Resume URL
          </label>
          <input
            type="url"
            value={personalInfo.resume_url || ''}
            onChange={(e) => setPersonalInfo({...personalInfo, resume_url: e.target.value})}
            className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
            placeholder="https://..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              <span>Save Links</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default PortfolioManagement

