import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page not-found">
      <span className="eyebrow">404 · 길을 다시 찾아볼까요?</span>
      <h1>이 페이지를 찾을 수 없습니다.</h1>
      <p>주소가 바뀌었거나 아직 등록되지 않은 지식입니다.</p>
      <Link className="button" href="/">
        오늘의 지식으로 돌아가기
      </Link>
    </div>
  );
}
