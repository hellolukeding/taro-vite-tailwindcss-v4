export interface PromptItem {
  id: number
  title: string
  desc: string
  avatar: string
  image: string
  likes: number
  comments: number
}

export interface PromptSquareProps {
  data: PromptItem[]
}
