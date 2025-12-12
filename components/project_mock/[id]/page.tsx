import { notFound } from "next/navigation"
import ProjectDetailContent from "@/components/project-detail-content"

interface ProjectDetailsPageProps {
    params: {
        id: string
    }
}

// Mock project data - will be replaced with database queries later
export const mockProjects = [
    {
        id: 1,
        title: "AI Lab Research Initiative - Advanced Machine Learning Systems",
        description:
            "Our research initiative focuses on developing state-of-the-art machine learning systems for real-world applications. The project encompasses multiple research areas including computer vision, natural language processing, and reinforcement learning. We aim to push the boundaries of artificial intelligence by creating novel deep learning architectures that can learn from complex, high-dimensional data. A significant part of our work involves developing more efficient training algorithms to reduce the computational cost and carbon footprint of large-scale models. The project also emphasizes the practical application of our research, with a dedicated team working to build and deploy real-world applications in domains such as healthcare, finance, and autonomous systems. This ensures our theoretical advancements translate into tangible benefits for society. Ultimately, our goal is to not only advance the field of machine learning but also to share our findings with the broader community by publishing our research in top-tier conferences and journals, fostering collaboration and open innovation.",
        status: "active",
        department: "Computer Science & Engineering",
        field: "Machine Learning",
        startDate: "2023-09-01",
        endDate: null,
        funding: "$250,000",
        fundingSource: "National Science Foundation",
        objectives: [
            "Develop novel deep learning architectures",
            "Create efficient training algorithms",
            "Build real-world applications",
            "Publish research findings",
        ],
        files: [
            {
                id: 1,
                type: "document",
                file_name: "Project_Proposal.pdf",
                file_size: 2202009,
                file_type: "pdf",
                external_url: null,
            },
            {
                id: 2,
                type: "document",
                file_name: "Initial_Report.docx",
                file_size: 5502009,
                file_type: "doc",
                external_url: null,
            },
            {
                id: 3,
                type: "code",
                file_name: "GitHub Repository",
                file_size: null,
                file_type: "github",
                external_url: "https://github.com/sust-research-hub/thesis-repository-frontend",
            },
            {
                id: 4,
                type: "dataset",
                file_name: "ImageNet-Subset.zip",
                file_size: 1073741824,
                file_type: "zip",
                external_url: null,
            },
            {
                id: 5,
                type: "result",
                file_name: "Preliminary Results",
                file_size: null,
                file_type: "link",
                external_url: "https://www.example.com/results",
            },
        ],
        team: [
            {
                id: 1,
                full_name: "Dr. Ahmed Hassan",
                role: "Principal Investigator",
                profile_pic: null,
            },
            {
                id: 2,
                full_name: "Sarah Mohamed",
                role: "Team Lead",
                profile_pic: null,
            },
            {
                id: 3,
                full_name: "Omar Ibrahim",
                role: "Research Assistant",
                profile_pic: null,
            },
        ],
        keywords: ["Machine Learning", "Deep Learning", "AI Research", "Computer Vision", "NLP"],
        theses: [
            { id: 1, title: "Deep Learning for Image Recognition", status: "published" },
            { id: 2, title: "Natural Language Processing Systems", status: "in_progress" },
        ],
        publications: [
            {
                id: 1,
                title: "Advances in Convolutional Neural Networks",
                journal: "IEEE Transactions on Neural Networks",
                year: 2024,
            },
        ],
        datasets: [{ id: 1, name: "ImageNet Custom Dataset", size: "50GB", format: "TensorFlow" }],
        models: [{ id: 1, name: "ResNet-152 Custom", accuracy: "96.5%", framework: "PyTorch" }],
        collaborations: ["MIT AI Lab", "Stanford NLP Group"],
        views: 2341,
        created_at: "2023-09-01",
        updated_at: "2024-12-10",
    },
    {
        id: 2,
        title: "Biomedical Engineering Group - Medical Device Innovation",
        description:
            "A collaborative research project aimed at developing innovative biomedical devices and diagnostic tools. We combine engineering principles with medical science to create solutions for healthcare challenges. Our interdisciplinary team of engineers, scientists, and clinicians works together to identify unmet clinical needs and design novel diagnostic devices that are both accurate and accessible. The project includes rigorous clinical trials to validate the safety and efficacy of our new technologies, ensuring they meet the highest standards of patient care. In parallel, we are developing scalable manufacturing processes to enable the widespread adoption of our devices. A key objective is to navigate the complex regulatory landscape and secure approval from relevant authorities, such as the FDA and EMA. By bridging the gap between the laboratory and the clinic, we hope to make a lasting impact on global health and improve patient outcomes. Our work is driven by a commitment to innovation, collaboration, and the pursuit of excellence in biomedical engineering.",
        status: "active",
        department: "Biochemistry",
        field: "Biomedical",
        startDate: "2023-06-01",
        endDate: null,
        funding: "$180,000",
        fundingSource: "Medical Research Council",
        objectives: [
            "Design novel diagnostic devices",
            "Conduct clinical trials",
            "Develop manufacturing processes",
            "Secure regulatory approval",
        ],
        team: [
            {
                id: 3,
                full_name: "Dr. Sarah Ibrahim",
                role: "Principal Investigator",
                profile_pic: null,
            },
            {
                id: 4,
                full_name: "Youssef Ali",
                role: "Team Lead",
                profile_pic: null,
            },
        ],
        keywords: ["Biomedical", "Medical Devices", "Healthcare", "Diagnostics", "Innovation"],
        theses: [],
        publications: [],
        datasets: [],
        models: [],
        collaborations: ["Johns Hopkins Medical Center"],
        views: 1876,
        created_at: "2023-06-01",
        updated_at: "2024-12-07",
    },
    {
        id: 3,
        title: "Robotics Lab Projects - Autonomous Systems Development",
        description:
            "Research and development of autonomous robotic systems with applications in manufacturing, logistics, and service industries. The project explores navigation, manipulation, and human-robot interaction. Our team is focused on building robust autonomous navigation systems that can operate reliably in dynamic and unstructured environments. This involves the use of advanced sensor fusion techniques, combining data from LiDAR, cameras, and IMUs to create a comprehensive understanding of the robot's surroundings. We are also developing sophisticated manipulation algorithms that enable our robots to perform complex tasks with precision and dexterity. To ensure our systems are practical and effective, we conduct extensive testing in real-world scenarios, working closely with industry partners to identify and address key challenges. Safety is a top priority, and we are committed to creating comprehensive safety protocols to govern the operation of our autonomous systems. Through our research, we aim to advance the state-of-the-art in robotics and contribute to the development of next-generation autonomous systems that can work alongside humans to improve productivity and quality of life.",
        status: "active",
        department: "Mechanical Engineering",
        field: "Robotics",
        startDate: "2024-01-15",
        endDate: null,
        funding: "$320,000",
        fundingSource: "Department of Defense",
        objectives: [
            "Build autonomous navigation systems",
            "Develop manipulation algorithms",
            "Test in real-world scenarios",
            "Create safety protocols",
        ],
        team: [
            {
                id: 5,
                full_name: "Prof. Hassan Khaled",
                role: "Principal Investigator",
                profile_pic: null,
            },
            {
                id: 6,
                full_name: "Fatima Ahmed",
                role: "Team Lead",
                profile_pic: null,
            },
        ],
        keywords: ["Robotics", "Autonomous Systems", "Navigation", "Control Systems", "AI"],
        theses: [],
        publications: [],
        datasets: [],
        models: [],
        collaborations: ["Boston Dynamics", "Toyota Research Institute"],
        views: 3421,
        created_at: "2024-01-15",
        updated_at: "2024-12-11",
    },
]

export default async function ProjectDetailPage({ params }: ProjectDetailsPageProps) {
    const { id } = await params
    const projectId = Number.parseInt(id)

    if (Number.isNaN(projectId)) {
        notFound()
    }

    const project = mockProjects.find((p) => p.id === projectId)

    if (!project) {
        notFound()
    }

    return <ProjectDetailContent project={project} />
}