import ContentWrapper from '@/components/ContentWrapper'
import ModalLogIn from '@/components/ModalLogIn'

export default function AuthPage() {
  return (
    <div>
      <ContentWrapper>
        <ModalLogIn isModal={false} />
      </ContentWrapper>
    </div>
  )
}
