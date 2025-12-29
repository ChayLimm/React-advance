// Portfolio.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GithubOutlined, 
  LinkedinOutlined, 
  MailOutlined, 
  LinkOutlined,
  CalendarOutlined,
  CodeOutlined,
  RocketOutlined,
  UserOutlined,
  ToolOutlined,
  BuildOutlined,
  ExperimentOutlined,
  StarOutlined,
  EnvironmentOutlined,
  BookOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { Card, Tag, Button, Modal, Image, Tooltip, Avatar, Divider } from "antd";
import { getDocuments } from "./firebaseService/crud";
import type { UserProp, ProjectProp, ExperienceProp } from "./types/Portfolio";

export default function Portfolio() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProp | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectProp | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      if (data) {
        const userData: UserProp = {
          ...data,
          projects: data.projects || [],
          skills: data.skills || [],
          experiences: data.experiences || [],
        };
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueTechnologies = () => {
    if (!user?.projects) return [];
    const allTech = user.projects.flatMap(p => p.technologies || []);
    return [...new Set(allTech)];
  };

  const filteredProjects = () => {
    if (!user?.projects) return [];
    if (activeFilter === "all") return user.projects;
    return user.projects.filter(project => 
      project.technologies?.includes(activeFilter)
    );
  };

  const openProjectModal = (project: ProjectProp) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getExperienceDuration = (startDate: string, endDate?: string, currentlyWorking?: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : currentlyWorking ? new Date() : null;
    
    if (!end) return formatDate(startDate);
    
    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth() + (yearsDiff * 12);
    
    if (monthsDiff < 12) {
      return `${monthsDiff} month${monthsDiff !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(monthsDiff / 12);
      const remainingMonths = monthsDiff % 12;
      return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Card className="max-w-md text-center bg-gray-800 border-gray-700 shadow-2xl">
          <div className="text-5xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Portfolio Data Found</h2>
          <p className="text-gray-400 mb-6">Create your amazing portfolio in just a few clicks</p>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none shadow-lg"
          >
            Get Started
          </Button>
        </Card>
      </div>
    );
  }

  const allTechnologies = getUniqueTechnologies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/90 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative">
                <StarOutlined className="text-blue-400 text-2xl animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user.username}
              </span>
            </motion.div>
            
            {/* <Button
              type="primary"
              ghost
              icon={<BuildOutlined />}
              onClick={() => navigate("/dashboard")}
              className="border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:border-blue-300 transition-all"
            >
              Edit Portfolio
            </Button> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="relative w-40 h-40 mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                <Avatar 
                  size={96} 
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl border-4 border-gray-900"
                />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-300">Hi, I'm </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                {user.username}
              </span>
            </motion.h1>
            
            <motion.div 
              className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MailOutlined className="text-blue-400 mr-3" />
              <span className="text-lg text-gray-300">{user.email}</span>
              {user.age && (
                <>
                  <Divider type="vertical" className="border-gray-700 h-6 mx-4" />
                  <span className="text-lg text-gray-300">{user.age} years old</span>
                </>
              )}
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {user.bio || "Passionate developer creating amazing digital experiences"}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="primary"
                size="large"
                icon={<MailOutlined />}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none shadow-lg transform hover:-translate-y-1 transition-all"
              >
                Contact Me
              </Button>
              
              {/* <Button
                size="large"
                icon={<BuildOutlined />}
                onClick={() => navigate("/dashboard")}
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600 hover:text-white shadow-lg transform hover:-translate-y-1 transition-all"
              >
                Edit Portfolio
              </Button> */}
            </motion.div>
            
            <motion.div 
              className="flex justify-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: <GithubOutlined />, label: "GitHub", href: "#" },
                { icon: <LinkedinOutlined />, label: "LinkedIn", href: "#" },
                { icon: <MailOutlined />, label: "Email", href: `mailto:${user.email}` },
                { icon: <LinkOutlined />, label: "Website", href: "#" },
              ].map((social) => (
                <Tooltip title={social.label} key={social.label}>
                  <a 
                    href={social.href}
                    className="group p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all transform hover:-translate-y-1"
                  >
                    <div className="text-2xl text-gray-400 group-hover:text-blue-400 transition-colors">
                      {social.icon}
                    </div>
                  </a>
                </Tooltip>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      {user.skills && user.skills.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl">
                <ToolOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">Skills & Expertise</h2>
              <p className="text-gray-400 text-xl">Technologies I work with</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {user.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group"
                    hoverable
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CodeOutlined className="text-2xl text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {skill}
                      </h3>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {user.experiences && user.experiences.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 mb-6 shadow-2xl">
                <BuildOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">Professional Experience</h2>
              <p className="text-gray-400 text-xl">My career journey</p>
            </motion.div>
            
            <div className="max-w-6xl mx-auto">
              <div className="space-y-8">
                {user.experiences
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {index < user.experiences.length - 1 && (
                        <div className="absolute left-6 top-24 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-transparent"></div>
                      )}
                      
                      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 ml-10">
                        <div className="absolute -left-10 top-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <CalendarOutlined className="text-xl text-white" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                              {exp.currentlyWorking && (
                                <Tag color="green" className="border-none rounded-full px-3 py-1 text-sm font-semibold">
                                  Current
                                </Tag>
                              )}
                            </div>
                            
                            <div className="flex items-center text-gray-300 mb-4">
                              <BuildOutlined className="mr-3 text-blue-400" />
                              <span className="text-lg font-medium">{exp.company}</span>
                              {exp.location && (
                                <>
                                  <span className="mx-3 text-gray-600">•</span>
                                  <EnvironmentOutlined className="mr-2" />
                                  <span className="text-gray-400">{exp.location}</span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center text-gray-400 mb-6">
                              <CalendarOutlined className="mr-3 text-blue-400" />
                              <span className="text-lg">
                                {formatDate(exp.startDate)} -{' '}
                                {exp.currentlyWorking 
                                  ? 'Present' 
                                  : exp.endDate 
                                    ? formatDate(exp.endDate)
                                    : 'N/A'
                                }
                                <span className="ml-4 px-3 py-1 bg-gray-900/50 rounded-full text-sm">
                                  {getExperienceDuration(exp.startDate, exp.endDate, exp.currentlyWorking)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">{exp.description}</p>
                        
                        {exp.skills && exp.skills.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <TrophyOutlined className="mr-2 text-yellow-400" />
                              Skills Used
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {exp.skills.map(skill => (
                                <Tag 
                                  key={skill} 
                                  color="blue" 
                                  className="border-none rounded-full px-4 py-2 text-sm font-medium shadow-lg"
                                >
                                  {skill}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {user.projects && user.projects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 mb-6 shadow-2xl">
                <RocketOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">Featured Projects</h2>
              <p className="text-gray-400 text-xl">Some of my recent work</p>
            </motion.div>

            {allTechnologies.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Button
                  type={activeFilter === "all" ? "primary" : "default"}
                  onClick={() => setActiveFilter("all")}
                  className={`rounded-full px-6 py-2 h-auto ${activeFilter === "all" 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-lg' 
                    : 'bg-gray-800/50 backdrop-blur-sm border-gray-700 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  All Projects
                </Button>
                {allTechnologies.slice(0, 6).map(tech => (
                  <Button
                    key={tech}
                    type={activeFilter === tech ? "primary" : "default"}
                    onClick={() => setActiveFilter(tech)}
                    className={`rounded-full px-6 py-2 h-auto ${activeFilter === tech 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-lg' 
                      : 'bg-gray-800/50 backdrop-blur-sm border-gray-700 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {tech}
                  </Button>
                ))}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects().map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -12 }}
                >
                  <Card
                    hoverable
                    className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-blue-500 overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                    cover={
                      <div className="h-56 overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900">
                        {project.imageUrl ? (
                          <Image
                            alt={project.name}
                            src={project.imageUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            preview={false}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <CodeOutlined className="text-5xl text-gray-600 mb-4" />
                              <p className="text-gray-500">No preview available</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
                      </div>
                    }
                    onClick={() => openProjectModal(project)}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <div className="flex space-x-3">
                        {project.githubUrl && (
                          <Tooltip title="View Code">
                            <a 
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-white transform hover:scale-110 transition-all"
                            >
                              <GithubOutlined className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                        {project.liveUrl && (
                          <Tooltip title="Live Demo">
                            <a 
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-white transform hover:scale-110 transition-all"
                            >
                              <RocketOutlined className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 4).map(tech => (
                        <Tag 
                          key={tech} 
                          color="blue" 
                          className="border-none rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {tech}
                        </Tag>
                      ))}
                      {project.technologies && project.technologies.length > 4 && (
                        <Tag className="border-none bg-gray-900/50 text-gray-300 rounded-full px-3 py-1 text-xs font-medium">
                          +{project.technologies.length - 4}
                        </Tag>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-4">By The Numbers</h2>
            <p className="text-gray-400 text-xl">A quick look at my work</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                value: user.projects?.length || 0, 
                label: "Projects", 
                icon: <RocketOutlined />,
                color: "from-blue-500 to-cyan-500"
              },
              { 
                value: user.skills?.length || 0, 
                label: "Skills", 
                icon: <ToolOutlined />,
                color: "from-purple-500 to-pink-500"
              },
              { 
                value: allTechnologies.length, 
                label: "Technologies", 
                icon: <ExperimentOutlined />,
                color: "from-orange-500 to-red-500"
              },
              { 
                value: user.age ? `${user.age}+` : "∞", 
                label: "Years Experience", 
                icon: <BookOutlined />,
                color: "from-green-500 to-emerald-500"
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center bg-gray-800/30 backdrop-blur-sm border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <div className="text-2xl text-white">{stat.icon}</div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
              <div className="relative z-10 text-center">
                <h2 className="text-5xl font-bold text-white mb-6">Ready to work together?</h2>
                <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  Let's create something amazing. Get in touch or update your portfolio to showcase your latest work.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Button
                    type="primary"
                    size="large"
                    icon={<MailOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none shadow-xl px-8 py-4 h-auto text-lg transform hover:-translate-y-1 transition-all"
                  >
                    Contact Me
                  </Button>
                  {/* <Button
                    size="large"
                    icon={<BuildOutlined />}
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600 hover:text-white shadow-xl px-8 py-4 h-auto text-lg transform hover:-translate-y-1 transition-all"
                  >
                    Edit Portfolio
                  </Button> */}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <StarOutlined className="text-blue-400 text-2xl animate-pulse" />
            <span className="text-2xl font-bold text-white">{user.username}</span>
          </motion.div>
         
          <div className="flex flex-wrap justify-center gap-6">
            <Button
              type="link"
              onClick={() => navigate("/dashboard")}
              className="text-blue-400 hover:text-blue-300 text-lg hover:underline"
            >
              Admin Dashboard
            </Button>
            <Button type="link" className="text-gray-400 hover:text-gray-300 text-lg hover:underline">
              Privacy Policy
            </Button>
            <Button type="link" className="text-gray-400 hover:text-gray-300 text-lg hover:underline">
              Terms of Service
            </Button>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <Modal
        title={<span className="text-2xl font-bold text-white">{selectedProject?.name}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        className="portfolio-modal"
        styles={{
          body: { 
            backgroundColor: '#1f2937', 
            color: 'white',
            padding: '32px'
          },
          header: { 
            backgroundColor: '#1f2937', 
            borderBottom: '1px solid #374151',
            color: 'white',
            padding: '20px 32px'
          }
        }}
      >
        {selectedProject && (
          <div className="space-y-8">
            {selectedProject.imageUrl && (
              <div className="relative h-80 overflow-hidden rounded-xl">
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                  preview={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
              </div>
            )}
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <BookOutlined className="mr-3 text-blue-400" />
                Description
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">{selectedProject.description}</p>
            </div>
            
            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <ToolOutlined className="mr-3 text-blue-400" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.technologies.map((tech) => (
                    <Tag 
                      key={tech} 
                      color="blue" 
                      className="border-none rounded-full px-5 py-2 text-base font-medium shadow-lg"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 pt-6 border-t border-gray-700">
              {selectedProject.githubUrl && (
                <Button 
                  icon={<GithubOutlined />} 
                  href={selectedProject.githubUrl}
                  target="_blank"
                  size="large"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600 px-8"
                >
                  View Code
                </Button>
              )}
              {selectedProject.liveUrl && (
                <Button 
                  icon={<RocketOutlined />} 
                  type="primary"
                  href={selectedProject.liveUrl}
                  target="_blank"
                  size="large"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none px-8"
                >
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add custom animations to global CSS */}
      {/* <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style> */}
    </div>
  );
}