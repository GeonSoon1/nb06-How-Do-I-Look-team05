---
title: "[How Do I Look] 안내"
source: "https://codeit.notion.site/How-Do-I-Look-f7a4fc63a83749118de5597335b68ca9"
author:
  - "[[Notion의 codeit]]"
published:
created: 2025-11-03
description: "A tool that connects everyday work into one space. It gives you and your teams AI tools—search, writing, note-taking—inside an all-in-one, flexible workspace."
tags:
  - "clippings"
---
## 개요

- 제목: How Do I Look
- 소개: 스타일 공유 및 큐레이팅 서비스
- 난이도: 초급
- 디자인 시안: [(How Do I Look) 다른 사람이 평가하는 내 옷의 트렌디 지수](https://www.figma.com/design/R5E7HmvW5zmYSkj48VJ11Q/How-Do-I-Look%5BAAA%5D-%EB%8B%A4%EB%A5%B8-%EC%82%AC%EB%9E%8C%EC%9D%B4-%ED%8F%89%EA%B0%80%ED%95%98%EB%8A%94-%EB%82%B4-%EC%98%B7%EC%9D%98-%ED%8A%B8%EB%A0%8C%EB%94%94-%EC%A7%80%EC%88%98?node-id=1873-2193&t=pccd1mLuXzd54PgE-1)
- 프론트엔드 예시 링크: [https://nb-project-howdoilook-fe.vercel.app/](https://nb-project-howdoilook-fe.vercel.app/)

## 기능 요구 사항

#### 스타일

- 스타일 등록
	-  항목: 사진(여러장 가능) 업로드, 태그(최대 3개), 제목, 닉네임, 스타일 구성, 스타일 설명, 비밀번호
	- 스타일 구성의 종류: 상의, 하의, 아우터, 원피스, 신발, 가방, 패션잡화
	- 스타일 구성별 의상명, 브랜드명, 가격 입력가능
	- → 필요기능: transaction
	  
- 스타일 수정
	- 스타일 등록 시 입력했던 비밀번호와 일치할 경우 스타일 수정
	  
- 스타일 삭제
	- 스타일 등록 시 입력했던 비밀번호와 일치할 경우 스타일 삭제
	  
- 스타일 목록 조회
	- 갤러리
		- 등록된 스타일 목록 조회
			- 표시항목: 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수
		- 갤러리 상단에 인기 태그 표시
			- 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록 표시
		- 페이지네이션 제공
		- 정렬: 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)
		- 검색: 닉네임, 제목, 상세, 태그로 검색 가능
	- 랭킹
		- 항목: 전체, 트렌디, 개성, 실용성, 가성비
		- 위 항목별 기준, 스타일 랭킹 목록 조회
		- 각 스타일 별 항목: 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수
		- 페이지네이션 제공
		  
- 스타일 상세 조회
	- 갤러리, 랭킹에서 스타일 클릭 스타일 상세 조회로 이동
	- 항목: 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수
	- 해당 스타일의 큐레이팅 목록 표시
	  
- 

#### 큐레이팅

- 큐레이팅 등록
	- 항목: 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임, 비밀번호
	  
- 큐레이팅 수정
	- 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 수정
	  
- 큐레이팅 삭제
	- 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제
	  
- 큐레이팅 목록 조회
	- 스타일을 조회할 경우 그 스타일에 해당되는 큐레이팅 목록 함께 조회
	- 항목: 각 큐레이팅의 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임
	- 검색:
		- 항목: 닉네임, 내용으로 검색 가능
		- 큐레이팅에 남겨진 답글도 함께 조회

#### 답글

- 답글 등록
	- 항목: 답글 내용, 비밀번호
	- 스타일 등록 시 입력했던 비밀번호와 일치하면 답글 등록가능
	- 답글은 큐레이팅 당 하나만 등록 가능
	  
- 답글 수정
	- 답글 등록 시 입력했던 비밀번호와 일치할 경우 답글 수정 가능
	  
- 답글 삭제
	- 답글 등록 시 입력했던 비밀번호와 일치할 경우 답글 삭제 가능
	  
- 답글 목록 조회
	- 큐레이팅을 조회시 해당 큐레이팅에 해당되는 답글도 함께 조회
	- 항목: 닉네임, 답글 내용


#### 미들웨어

- 유효성 검증
- 사진 업로드(메소드)
- 에러 처리
- 비밀번호 일치여부 확인 (메소드)
- 랭킹 계산 (메소드)
- cors

#### 논의 필요

- seeding
- 페이지네이션 구현: 
	- 룩북: offset?
	- 답글: cursor? 
- 


## 심화 요구 사항

#### 객체 지향 프로그래밍 적용

- Router 코드와 Request Handler 함수에 해당하는 코드 분리
- Request Handler에 해당하는 코드들을 모아서, Controller라는 클래스 구현
- Controller 클래스의 함수를 Router에서 등록

#### 일관된 에러처리 구현

- Express.js의 Global Error Handler 구현
- 개별 Request Handler에서 에러가 발생하는 경우, Global Error Handler에서 처리

#### ORM에서 select 고급 활용

- 스타일 목록 조회에서 관련된 큐레이팅의 개수를 리스폰스로 전달하는 경우처럼 연결된 모델의 개수가 필요한 경우, 하나의 `findMany()` 메서드 안 처리
- Prisma 공식 문서의 [Filter the relation count](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing#filter-the-relation-count) 를 참고하세요.