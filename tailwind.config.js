/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // 메인 배경색
        "main-bg": "#f3f4f6", // 페이지의 주요 배경색

        // 레이아웃 색상
        "layout-dark": "#1f2937", // 레이아웃 요소 (헤더, 사이드바 등) 배경색
        "layout-dark-light": "#374151", // 레이아웃의 보조 색상 (레이아웃 내 디테일용)

        // 보조 배경색
        "bg-secondary": "#e5e7eb", // 톤다운된 보조 배경색 (카드, 모달 등)

        // 텍스트 색상
        "text-primary": "#1f2937", // 주 텍스트 색상
        "text-secondary": "#4b5563", // 보조 텍스트 색상
        "text-tertiary": "#9ca3af", // 추가 보조 텍스트 색상

        // 경계선 및 디바이더 색상
        border: "#d1d5db", // 경계선 및 디바이더 색상
        "border-dark": "#e4e7eb", // 다크 모드에서의 경계선 색상

        // 버튼 및 링크 색상
        "button-primary": "#4b5563", // 기본 버튼 색상
        "button-primary-hover": "#374151", // 버튼 호버 상태 색상
        "button-secondary": "#6b7280", // 보조 버튼 색상
        "button-secondary-hover": "#4b5563", // 보조 버튼 호버 상태 색상

        // 비활성 색상
        disabled: "#d1d5db", // 비활성 버튼 색상
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
