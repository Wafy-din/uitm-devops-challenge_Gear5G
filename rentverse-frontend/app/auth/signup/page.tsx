import ContentWrapper from '@/components/ContentWrapper'
import ModalSignUp from '@/components/ModalSignUp'

export default function AuthPage() {
  return (
    <div>
      <ContentWrapper>
        <ModalSignUp isModal={false} />
      </ContentWrapper>
    </div>
  )
}
