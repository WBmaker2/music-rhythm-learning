# 음악/리듬 학습 (Music Rhythm Learning) — 구현 계획

## 1. 개요
Web Audio API로 음정·박자·리듬을 시각+청각으로 연습하는 웹앱.
피아노/드럼 인터페이스, 리듬 따라치기, 멜로디 재생. API 없이 동작.

## 2. 목표 사용자
- 초·중학생, 음악 수업, 자기주도 학습자

## 3. 핵심 기능
- 가상 피아노/드럼 패드 (터치/키보드)
- 리듬 따라치기 게임 (박자 정확도 측정)
- 멜로디 재생 & 시각적 악보(간이)
- BPM 조절, 메트로놈
- 녹음/재생 (MediaRecorder)
- 연습 모드: 음계, 코드, 리듬 패턴
- 진행도 저장

## 4. 화면 구성
- 홈: 모드 선택
- 피아노: 건반 UI + 음 재생
- 리듬 게임: 노트 낙하 + 판정
- 녹음/재생
- 설정: BPM, 음색

## 5. 기술 스택
- React + Vite + TypeScript
- 오디오: Web Audio API (Oscillator, Gain)
- 시각화: Canvas
- 녹음: MediaRecorder API
- 저장: localStorage

## 6. 데이터 모델
- Note { pitch, start, duration }
- Pattern { id, name, notes, bpm }
- Score { accuracy, combo, maxCombo }
- Progress { patternsCompleted, bestScores }

## 7. 구현 단계
1. 세팅
2. Web Audio 엔진 (음 생성, 메트로놈)
3. 피아노 UI
4. 리듬 게임 (노트/판정)
5. 녹음/재생
6. 패턴 라이브러리
7. 진행도 저장
8. 접근성(키보드)

## 8. 비기능 요구사항
- 저지연 오디오
- 모바일 터치

## 9. 검증
- 단위: 판정 로직
- 수동: 지연/음질 확인
