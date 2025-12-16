import ContentWrapper from '@/components/ContentWrapper'
import ModalEmailCheck from '@/components/ModalEmailCheck'

export default function AuthPage() {
  return (
    <div>
      <ContentWrapper>
        <ModalEmailCheck isModal={false} />
      </ContentWrapper>
    </div>
  )
}
