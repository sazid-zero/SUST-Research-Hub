import Link from "next/link"

interface ThesisAuthorLinkProps {
  name: string
  studentId?: string
  authorType?: "student" | "supervisor"
  username?: string
}

export function ThesisAuthorLink({ 
  name, 
  studentId, 
  authorType = "student",
  username 
}: ThesisAuthorLinkProps) {
  if (authorType === "student" && studentId) {
    return (
      <Link 
        href={`/student/profile/${studentId}`}
        className="text-primary hover:underline font-medium"
      >
        {name}
      </Link>
    )
  }
  
  if (authorType === "supervisor" && username) {
    return (
      <Link 
        href={`/supervisor/profile/${username}`}
        className="text-primary hover:underline font-medium"
      >
        {name}
      </Link>
    )
  }
  
  return <span className="font-medium">{name}</span>
}
