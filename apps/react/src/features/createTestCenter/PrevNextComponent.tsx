import { Button } from '@/components/ui/button'

type PrevNextComponentProps = {
  prevHandler: () => void
}

export const PrevNextComponent = ({ prevHandler }: PrevNextComponentProps) => {
  return (
    <div className="space-x-5">
      <Button variant="outline" onClick={prevHandler} type="button">
        Prev
      </Button>
      <Button type="submit">Next</Button>
    </div>
  )
}
