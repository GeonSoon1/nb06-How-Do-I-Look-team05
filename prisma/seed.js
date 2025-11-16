import { PrismaClient } from '@prisma/client';
import { fakerKO as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('한국어 더미데이터 생성 시작...');

  // 1. 중복 없는 태그 생성
  const tagPool = [
    '트렌디',
    '심플',
    '모던',
    '빈티지',
    '스트릿',
    '미니멀',
    '유니크',
    '럭셔리',
    '캐주얼',
    '스포티',
    '페미닌',
    '댄디',
    '모노톤',
    '컬러풀',
    '편안함',
    '포멀',
    '레트로',
    '클래식',
    '청량감',
    '자연스러움',
  ];

  const titlePool = [
    'GQ 디올 남주혁 화보',
    '방탄소년단 RM은 영포티도 그냥 다 소화하네요',
    '로이킴 UV 유튜브 등장',
    '라코스테 SS26 런웨이 쇼 엑소 카이',
    '지창욱 톰포드 패션',
    '투모로우바이투게더 수빈 발렌티노 쇼 참석',
    '투바투 수빈이 입은 대학생 룩',
    '김우빈은 역시 수트인가',
    '오늘자 덱스 청청 기사사진',
    '투바투 태현이 착용한 칼린 가방',
    '버버리 아트스페이스 손석구형',
    '손동표 도산공원 산책 룩',
    '이종석 X 에스.티.듀퐁 WWD 화보',
  ];

  const descriptionPool = [
    '무신사 스탠다드 경량 패딩 트렌드 업고 압도적 1위 무신사 고객들의 지난 한 달간의 소비 패턴을 분석하여 패션 트렌드를 알아볼 수 있는 월간 랭킹 콘텐츠. 본격적인 추위가 닥치기 시작한 지난 10월, 무신사 패션 피플들은 과연 어떤 브랜드의 아이템에 주목했을까? 지금 아래 무신사 월간 랭킹을 확인하고 겨울 소비 트렌드에 주목해 보자.',
    '무신사 스토어 전체 브랜드 랭킹 1위의 영광을 차지한 브랜드는 바로 무신사 스탠다드 (MUSINSA STANDARD). FW 시즌 합리적인 가격으로 어디에나 부담없이 스타일링하기 좋은 베이직 & 트렌디 아우터로 인기를 끌며 당당히 1위를 차지했다. ',
    '찬바람을 막아줄 경량 패딩은 10월에도 필수 아이템으로 자리했다. 시티 레저 시어 립스탑 후디드 라이트 다운 재킷은 겉감에 시어 립 스톱 나일론 소재를 적용하여 내구성을 확보하고, 발수 코팅 처리로 생활 방수 기능까지 갖춘 제품이다. 후드 일체형 설계는 목과 두상을 자연스럽게 감싸 바람 차단 효과와 함께 외관의 완성도를 동시에 추구한다. 훌륭한 가성비와 스타일리시한 디자인 덕에 재입고 족족 빠른 품절을 기록하고 있다.',
    '브랜드 랭킹 2위는 아디다스 (ADIDAS). 여전히 러닝화, 트랙 재킷, 후디 등 클래식 스포츠웨어 라인의 인기가 뜨겁다. 특히 삼바, 도쿄, 캠퍼스 등 스니커즈 라인은 가을과 겨울 시즌에도 캐주얼룩의 주요 아이템으로 꾸준한 사랑을 받으며 랭킹을 지켰다.',
    '10월 아디다스의 화제 아이템은 무신사 에디션으로 출시한 와플 BB 트랙탑이 차지했다. 부드러운 와플 조직감과 여유 있는 실루엣이 돋보이는 이 트랙탑은 환절기 캐주얼 아우터로 폭발적인 인기를 얻었다. 특히 빈티지한 트랙탑 디자인을 현대적인 감각으로 재해석하여, 스포티함과 트렌디함을 모두 갖추었다는 평가를 받았다. 다른 스포티 라인업과 함께 아디다스의 랭킹 상승에 크게 기여한 아이템.',
    '전체 브랜드 랭킹 3위를 차지한 주인공은 무신사 스탠다드 우먼 (MUSINSA STANDARD WOMAN). 환절기와 겨울을 아우르는 코트와 패딩 종류의 아우터가 판매를 주도하며 랭킹을 견인했다. 한소희와 함께한 캠페인 화보 역시 인기의 비결일 것.',
    '무신사 스탠다드 우먼의 10월 화제 아이템은 배우 한소희가 착용하여 화제를 모은 우먼즈 캐시미어 블렌드 발마칸 로브 코트다. 캐시미어 블렌드 소재를 사용하여 고급스럽고 우아한 질감과 보온성을 동시에 갖추었으며, 루즈한 핏과 발마칸코트 디자인 특유의 클래식한 무드로 가을·겨울 시즌 포멀룩과 캐주얼룩 모두에 활용도가 높다. 허리 로브를 이용해 다양한 스타일링을 연출할 수도 있다.',
    '랭킹 4위는 스포츠웨어의 아이콘이자 스트리트 컬처의 상징인 나이키 (NIKE). 압도적인 브랜드 헤리티지와 혁신적인 기술력을 바탕으로 매 시즌 트렌드를 선도한다. 특히 10월에는 계절을 반영한 헤리티지 스니커즈와 클래식 의류 라인업이 고루 인기를 얻으며 무신사 랭킹 최상위권을 견고하게 지켰다.',
    '10월 나이키를 책임진 스니커즈는 에어 포스 1 07 W - 카카오 와우:샌드드리프트. 차분하면서도 감각적인 카카오 컬러와 텍스처가 특징으로, 가을과 겨울 분위기에 완벽하게 어울린다. 특유의 클래식한 에어 포스 1 실루엣 덕분에 캐주얼은 물론 포멀룩에도 매치하기 좋다.',
    '랭킹 5위에 진입한 브랜드는 바로 노스페이스 (THE NORTH FACE). 본격적인 겨울 아우터 시즌이 시작되면서 노스페이스의 헤비 다운재킷에 대한 수요가 폭발적으로 증가했다.',
    '10월 랭킹을 이끈 노스페이스의 대표 아이템은 리마스터 다운 자켓이다. 노스페이스의 기술력을 집약한 대표적인 헤비 다운재킷으로, 뛰어난 보온성과 견고한 디자인을 자랑한다. 추위가 본격화되면서 가장 먼저 대비하려는 고객들의 선택을 받아 많은 인기를 얻고 있다.',
    '이 밖에도 푸마, 커버낫, 뉴발란스, 트릴리온, 디미트리블랙이 각각 10위부터 6위까지 순위에 들며 저력을 입증했다. 10월 핫 브랜드의 쇼핑 데이터를 참고해 올겨울 트렌디한 나만의 착장을 꾸려 보는 건 어떨까? ',
    '1964년 설립된 나이키(NIKE)는 다양한 컬래버레이션과 두터운 마니아층들로 그 위치를 증명하는 브랜드입니다. 자신의 한계를 뛰어넘는 스포츠 정신이 바로 나이키 브랜드를 상징하며, 실패를 두려워하지 말라는 메시지는 많은 사람들에게 긍정적인 희망을 주어 나이키의 핵심 가치이자 철학으로 자리매김했습니다. 나이키는 운동 선수들의 목소리에 귀를 기울이고, 그들이 최고의 기량을 발휘할 수 있도록 돕는 제품을 생산합니다. 세계적인 발자취, 혁신 문화와 팀 우선 정신을 바탕으로 전 세계를 위한 끊임없는 스포츠의 미래를 창조하고 있습니다',
    '스포츠 라이프스타일은 라커룸 밖에서도 계속됩니다. 1920년부터 독일의 헤르초게나우라흐에서 스포츠 슈즈를 만들던 아디다스(ADIDAS)는 이러한 철학을 토대로 경기장에서부터 거리에 이르기까지 모두가 즐길 수 있는 스포츠 라이프스타일의 개념을 처음으로 도입한 브랜드입니다. 스포츠 영역의 다양한 요소를 일상의 영역으로 가져오는 아디다스는 이를 통해 전 세계의 트렌드를 주도하고 있으며, 지금도 여전히 자신의 다양한 모습을 보여주고 싶어하는 소비자와 직접 소통하며 함께 혁신적인 트렌드를 만들고 있습니다.',
    '노스페이스(THE NORTH FACE)는 브랜드 고유의 디자인 과학과 기술 혁신을 통해 인간이 자연과의 더 나은 공존을 경험할 수 있도록 지원해오고 있으며, 브랜드 모토인 끊임없는 탐험(Never Stop Exploring)을 실천하여 탐험과 도전을 통해 나아가는 브랜드입니다.',
  ];

  const commentPool = [
    // 칭찬/감탄 (1-10)
    '이 코디 완전 제 취향이에요. 분위기 미쳤다!',
    '색감 매치가 정말 예술이네요. 저장하고 갑니다.',
    '와, 옷이랑 배경이랑 완벽해요. 힙하다 힙해!',
    '꾸민 듯 안 꾸민 듯, 이런 내추럴한 룩 좋아요.',
    '어디서 이런 유니크한 템을 찾으셨나요? 최고!',
    '오늘 본 코디 중에 제일 멋져요! 센스 배우고 가요.',
    '와... 이건 진짜 모델 핏이네요. 부럽습니다.',
    '분위기 무엇... 그냥 화보를 찍으셨네요.',
    '아이템 하나하나 다 너무 예뻐요. 완벽한데요?',
    '이런 톤온톤 코디 너무 세련되고 예뻐요.',

    // 아이템/정보 문의 (11-20)
    '가방 정보가 너무 궁금해요! 어디 제품인가요?',
    '신발이 포인트네요. 혹시 실례가 안 되면 정보 좀...',
    '이 바지 핏이 너무 예쁜데, 구매처 알 수 있을까요?',
    '혹시 이 사진... 어떤 필터 사용하셨는지 궁금해요!',
    '셔츠 재질이 좋아 보여요. 브랜드 정보 부탁드려요!',
    '안경도 패션 아이템인가요? 너무 잘 어울려요.',
    '아우터 탐나네요. 혹시 어느 브랜드인지 알 수 있을까요?',
    '모자가 너무 귀여워요! 어디서 사셨어요?',
    '시계가 룩이랑 찰떡이네요. 정보 공유 가능할까요?',
    '혹시 상의 사이즈 팁 좀 주실 수 있나요?',

    // 공감/기타 반응 (21-30)
    '저도 이런 빈티지 스타일 완전 좋아합니다!',
    '이렇게 입고 데이트 가고 싶네요. 참고할게요!',
    '당장 따라 사고 싶은 룩이네요. 뽐뿌 옵니다.',
    '깔끔한 남친룩의 정석이네요. 잘 보고 가요.',
    '이런 스트릿 무드 너무 좋아요. 완전 힙해요.',
    '딱 제가 찾던 스타일이에요! 코디 참고하겠습니다.',
    '봄나들이 룩으로 딱이네요. 저장합니다!',
    '결혼식 하객룩으로도 손색없을 것 같아요.',
    '편안해 보이면서 스타일까지 잡았네요. 대박!',
    '이 조합은 생각도 못 했는데... 센스 미쳤다!',
  ];

  const brandPool = [
    // 럭셔리 & 하이엔드 (1-10)
    '구찌',
    '프라다',
    '디올',
    '루이비통',
    '샤넬',
    '생로랑',
    '발렌시아가',
    '보테가 베네타',
    '메종 마르지엘라',
    '셀린느',

    // 컨템포러리 & 캐주얼 (11-20)
    '아페쎄 (A.P.C.)',
    '아미 (AMI)',
    '아크네 스튜디오',
    '마르니',
    '스톤 아일랜드',
    '코스 (COS)',
    '폴로 랄프로렌',
    '라코스테',
    '타미 힐피거',
    '가니',

    // 스트릿 & 국내 (21-30)
    '슈프림',
    '스투시',
    '오프화이트',
    '팔라스',
    '칼하트 WIP',
    '휴먼 메이드',
    '베이프',
    '디스이즈네버댓',
    '파타고니아',
    '노아',

    // 스포츠 & 라이프스타일 (31-40)
    '나이키',
    '아디다스',
    '뉴발란스',
    '아식스',
    '푸마',
    '리복',
    '반스',
    '컨버스',
    '살로몬',
    '룰루레몬',
  ];

  const itemPool = [
    // 상의 (1-8)
    '오버핏 반팔 티셔츠',
    '옥스포드 셔츠',
    '스트라이프 셔츠',
    '니트 스웨터',
    '캐시미어 가디건',
    '크롭 맨투맨',
    '후드 집업',
    '폴로 셔츠',

    // 하의 (9-15)
    '와이드 데님 팬츠',
    '슬림핏 슬랙스',
    '코튼 치노 팬츠',
    '벌룬 팬츠',
    '스웨트 조거 팬츠',
    'A라인 롱 스커트',
    '플리츠 스커트',

    // 아우터 (16-20)
    '블루종 재킷',
    '트러커 재킷',
    '발마칸 코트',
    '트렌치 코트',
    '경량 패딩 조끼',

    // 신발 (21-25)
    '독일군 스니커즈',
    '화이트 스니커즈',
    '첼시 부츠',
    '로퍼',
    '어글리 슈즈',

    // 액세서리/잡화 (26-30)
    '볼캡',
    '비니',
    '에코백',
    '레더 크로스백',
    '뿔테 안경',
  ];

  const uniqueTags = new Set();
  while (uniqueTags.size < 20) {
    uniqueTags.add(faker.helpers.arrayElement(tagPool));
  }

  const tags = await Promise.all(
    Array.from(uniqueTags).map((tag) =>
      prisma.tag.create({
        data: {
          tag,
          styleCount: faker.number.int({ min: 0, max: 200 }),
          clickCount: faker.number.int({ min: 0, max: 1000 }),
        },
      }),
    ),
  );

  // 2. 스타일 100개 생성
  for (let i = 0; i < 100; i++) {
    const style = await prisma.style.create({
      data: {
        nickName: faker.animal.petName({ min: 2, max: 10 }),
        title: faker.helpers.arrayElement(titlePool),
        description: faker.helpers.arrayElement(descriptionPool),
        password: faker.number.int({ min: 1000, max: 9999 }).toString(),
        trendyAverage: faker.number.float({ min: 1, max: 10 }).toFixed(1),
        uniqueAverage: faker.number.float({ min: 1, max: 10 }).toFixed(1),
        practicalAverage: faker.number.float({ min: 1, max: 10 }).toFixed(1),
        costEffectiveAverage: faker.number.float({ min: 1, max: 10 }).toFixed(1),
        totalAverage: faker.number.float({ min: 1, max: 10 }).toFixed(1),
        viewCount: faker.number.int({ min: 0, max: 5000 }),

        // 태그 랜덤 연결 (1~4개)
        tags: {
          connect: faker.helpers
            .arrayElements(tags, faker.number.int({ min: 1, max: 4 }))
            .map((tag) => ({ id: tag.id })),
        },

        // 이미지
        images: {
          create: [
            {
              url: faker.image.urlPicsumPhotos({ width: 680, height: 960 }),
              isThumbnail: true,
            },
            ...Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
              url: faker.image.urlPicsumPhotos({ width: 680, height: 960 }),
              isThumbnail: false,
            })),
          ],
        },

        // 아이템
        items: {
          create: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }).map(() => ({
            itemName: faker.helpers.arrayElement(itemPool),
            brandName: faker.helpers.arrayElement(brandPool),
            price: faker.number.float({ min: 10000, max: 300000, precision: 1000 }),
            category: faker.helpers.arrayElement([
              'top',
              'bottom',
              'outer',
              'dress',
              'shoes',
              'bag',
              'accessory',
            ]),
          })),
        },

        // 큐레이션
        curations: {
          create: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
            trendy: faker.number.int({ min: 1, max: 10 }),
            personality: faker.number.int({ min: 1, max: 10 }),
            practicality: faker.number.int({ min: 1, max: 10 }),
            costEffectiveness: faker.number.int({ min: 1, max: 10 }),
            content: faker.lorem.paragraphs({ min: 1, max: 2 }),
            nickName: faker.animal.petName({ min: 2, max: 10 }),
            password: faker.number.int({ min: 1000, max: 9999 }).toString(),
            curationComment: faker.datatype.boolean()
              ? {
                  create: {
                    content: faker.helpers.arrayElement(commentPool),
                    password: faker.number.int({ min: 1000, max: 9999 }).toString(),
                  },
                }
              : undefined,
          })),
        },
      },
    });

    console.log(`스타일 생성 완료 (${i + 1}/100): ${style.title}`);
  }

  console.log('🌱 모든 한국어 더미 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error('시드 생성 중 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
