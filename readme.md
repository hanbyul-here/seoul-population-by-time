# Seoul Population By Time

Seoul Population By Time is the map showing how many people were active in the adnimistrative district every hour for a week. (from 3/4/2019 to 3/10/2019)

👉 [see the map](https://seoul-population-by-time.netlify.com/)

👉 Data is from [Seoul Open Data Portal](http://data.seoul.go.kr/dataVisual/seoul/seoulLivingPopulation.do)


## How to

### data processing

jupyter notebook that I wrote: https://gist.github.com/hanbyul-here/ed99daf0e0e192742fab72f1bff8340a

There are two main things that need to happen when data being processed.

- parse the population data into png image
- make hexagon geojson out of administrative data

+ format the data that cen be used in other tools such as Excel, KeplerGL.

### Visualization

Seoul Population By Time took the strategy that Patricio Gonzalez Vivo used for [Weather Over Time]((https://github.com/tangrams/WeatherOverTime/)) to make seamless animation with Tangram (3D rendering engine for map). To recap the strategy

- Data is encdoed in PNG image (row is each admin, column is time)
- This data png is passed as texture to each layer
- each layer reads the data from the texture, makes the shader to reflect this data.

 One thing to note is that Weather Over time used fragment shader while Seoul Population By Time used Vertex Shader to control the heights of hexagons. Since Vertex Shader gets compiled before Fragment Shader, there were some limitations such as Vertex Shader doesn't have access to color information. Some deilted difference of implementation, such as Seoul Population By Time used position.z(`extract`)to pass the index number to Shader while Weather Over Time used color, comes from this difference.


# 서울생활인구지도

서울생활인구지도  2019년 3월 4일부터 2019년 3월 10일까지, 1주일간 한시간 간격으로 각 행정지역마다의 생활인구를 성별, 연령대별로 시각화한 지도입니다.

👉 [프로젝트 바로가기](https://seoul-population-by-time.netlify.com/)

👉 데이터 출처: [서울열린데이터광장/서울생활인구](http://data.seoul.go.kr/dataVisual/seoul/seoulLivingPopulation.do)

## 개발일지

데이터 가공에 사용한 쥬피터 노트북 링크: https://gist.github.com/hanbyul-here/ed99daf0e0e192742fab72f1bff8340a

### 데이터 가공

- 일주일치 생활인구 데이터를 파싱해서 성별, 연령별로 취합한다.

시각화의 방법에 따라 기대되는 데이터의 포맷이 달라져서, 이 과정을 몇번 반복했는데, 결국 데이터를 픽셀 정보로 전환해서 PNG 텍스쳐로 저장하는 방법을 택했다. 이에대한 자세한 설명은 시각화 부분에서 하기로 한다.

- 생활인구의 행정구역 코드를 행정구역테이블을 이용해서 행정구역 지리데이터와 합친다.

한국엔 두 가지 행정코드가 통용되고있는데, 통계청은 7자리, 행자부는 8자리 각각 다른 행정코드를 사용한다. (왜 때무네...) 생활인구데이터에는 행자부에서 사용하는 8자리 코드가 사용되고, 통계청에서 보급하는 행정경계 데이터는 7자리 코드가 사용된다. 생활인구데이터 페이지에서 각 행정구역의 행자부 코드와 통계청 코드를 정리해놓은 CSV를 제공하는데, 이 데이터를 이용해서 생활인구 데이터와 행정경계 데이터를 연계할 수 있었다. 통계청의 행정구역 데이터는 readme.txt가 인코딩이 깨지길래 모 안읽어도 되겠찌 하고 안읽고 넘어갔다가 좌표계가 맞지 않아서 시간을 낭비했다. 리,리,리,리드미를 읽읍시다.

- 행정구역 지리데이터를 가공하여 육각형 형태로 만든다.

행정구역의 중심점에 육각형의 바그래프를 하나씩 심어주는 것이 목표였으므로, 이 바그래프의 베이스 모양(육각형)과 가공된 데이터와 연결고리가 되어줄 인덱스 넘버를 가진 geojson파일이 필요했다. 프로젝션을 무시하고 지오판다가 구해주는 각 행정구역 중심점에서 60도씩 돌리면서 점찍어 그려도 그럭저럭 육각형 모양이 나오길래 그냥 이대로 진행했다.

- 1과 2의 데이터를 합쳐 케플러(Kepler.gl), 엑셀 등 다른 플랫폼에서 사용할 수 있는 형태로 (CSV) 저장한다.

### 시각화 구현

#### 데이터 텍스쳐를 이용한 애니메이션 구현

 처음엔 지금까지 데이터를 업데이트 하는 방법으로 애니메이션을 구현했다. 모든 데이터를 하나의 오브젝트에 저장하고, 브라우저내에서 데이터를 포인팅하는 인덱스를 업데이트하고 이 때마다 탠그램에 업데이트된 데이터를 다시 물리는 방식. 문제는 애니메이션이 ... *느려!!* 애니메이션의 프레임이 크게 떨어질 뿐만 아니라, 렌더링 엔진이 업데이트하는 바그래프의 수가 많을 때(지도가 줌아웃되서 많은 그래프가 한 번에 보일 때)와 업데이트하는 바그래프의 수가 적을 때의 퍼포먼스가 눈에 띄게 차이가 나는 문제가 있었다.

변수 업데이트 후 이 변수를 탠그램에 패스하고, 탠그램이 이 변수를 기반으로 씬을 재구성하기를 기다리는 것은, 일회성 이벤트(버튼 등의  UI 이벤트에 따라 다른 데이터를 보여주거나 색상등의 속성 업데이트)를 구현하기엔 나쁘지 않지만, 순차적인 애니메이션을 만들기는 적합하지 않다는 것을 확인할 수 있는 기회였다. 나는 퍼포먼스가 안나오면 '자고 일어나면 더 나은 하드웨어가 냐오지 않을까?' 하고 쉽게 포기하는 그런 사람이지만... 전 동료가 탠그램을 이용해서 구현한 애니메이션을 봤던 기억이 있어서, 기억을 더듬어 Patricio Gonzalez Vivo가 몇 년 전 실험적으로 구현했던 프로젝트를 찾아냈다.

- [Weather Over Time](https://github.com/tangrams/WeatherOverTime/) by Patricio Gonzalez Vivo

Weather Over Time은 기상청 데이터에 기반하여 한 달 간의 기온, 풍향, 풍속을 시각화한 프로젝트인데 이 프로젝트에서 애니메이션을 구현한 방법은 다음과 같다.

- 데이터를 파싱하여 PNG 이미지로 옮긴다. (Weather Over Time의 경우 기온을 R channel, 풍향을  G channel, 풍속을 B channel로 옮겼다.)
- 데이터가 인코딩된 이미지를 해당 데이터 레이어의 셰이더의 텍스쳐로 패스한다.
- 브라우저내 스크립트는 셰이더 텍스처에서 읽어들일 픽셀값에 해당하는 인덱스를 업데이트한다.

서울생활인구 프로젝트에 데이터 텍스쳐 전략을 적용하기 위해서 찔끔찔끔 공부해왔던 셰이더 지식을 싹싹 긁어모아야 했는데, 이 프로젝트에 도움이 되었던 부분을 정리해보자면

- 셰이더는 픽셀이 사용자에게 어떻게 보이는지를 조절할 수 있는 3D 렌더링 엔진 내의 작은 프로그램이다.
- 셰이더는 하드웨어를 (GPU)를 가속, 각 픽셀마다의 프로세싱을 동시에 진행하면서 (parallel processing) 렌더링 퍼포먼스를 향상한다.
- 셰이더는 모양 을 담당하는 vertex shader와 색을 담당하는 fragment shader로 나뉜다. (좀 더 정확하게는 vertex shader는 3d 오브젝트의 기본이 되는 꼭지점들을 조작하고, fragment shader는 이 꼭지점 사이들의 픽셀이 어떻게 보일지를 정한다.)
- vertex shader가 먼저 실행된 후 fragment shader가 실행된다. (따라서 vertex shader에는 pixel의 색 속성에 대한 정보가 없다. 그래서 Weather Over Time는 색상을 이용해서 데이터 인덱스 값을 넘기지만, 서울생활인구 프로젝트는 높이값을 이용해서 인덱스값을 넘긴다.)
- 탠그램을 이용하여 사용자는 각각의 레이어에 적용되는 셰이더를 커스톰 할 수 있다.

🦄 셰이더를 이해하는 데에는 Patricio Gonzalez Vivo와 Jen Lowe의 [Book of Shader](https://thebookofshaders.com/01/)가 큰 도움이 되었다.

셰이더를 이용하기 위해 데이터 가공 과정으로 돌아가 데이터를 png 이미지로 변환했다. 데이터 손실을 줄이기 위해 최고값에 맞춰 bit depth를 설정했는데, 브라우저 레벨에서 어차피 8비트로 보간하여 PNG를 사용하기 때문에 그냥 데이터 텍스쳐를 생성할 때 8비트로 보간해서 생성하는 게 나았던 것 같기도. 생활인구 데이터 텍스쳐와 주거인구 데이터 텍스쳐를 비교해보면 데이터 텍스쳐가 엔진 내에서 어떻게 소비되는지 직관적으로 볼 수 있다. (각각의 행정구를 세로축, 시간을 가록축으로 생각하고 각각의 픽셀 값을 생활인구 데이터라고 생각하면 하나의 그래프처럼 읽을 수 있다. 픽셀 값이 흰색일 때(rgb 채널이 모두 최고값에 가까워 흰색으로 보일 때) 해당 지역, 시간의 인구 수가 많고, 어두운 색일 떄(rgb채널 값이 최저값에 가까워 검은색으로 보일 때) 적다.

- 생활인구

![생활인구 데이터 텍스쳐](https://raw.githubusercontent.com/hanbyul-here/seoul-population-by-time/master/data/20180827/total.png)

- 주거인구 (시간에 따라 데이터가 변하지 않으므로 열의 색깔이 바뀌지 않는다.)

![주거인구 데이터 텍스쳐](https://raw.githubusercontent.com/hanbyul-here/seoul-population-by-time/master/data/residents.png)

#### 탠그램 스타일파일에 셰이더 적용하기

구체적인 신탁스는 사용하는 렌더링 엔진에 따라 바뀔테니 굳이 적어놓지 않았는데, 쓴지 1년이 넘으니 내가 다 가물가물해져서 적어놓기로 했다. 애니메이션 구현 부분을 중심으로 기술해보기로 한다. [전체 스타일 파일은 이 곳에](https://github.com/hanbyul-here/seoul-population-by-time/blob/master/timeline.yaml)

우선 가공된 데이터 텍스쳐를 탠그램의 텍스쳐 블락에 '나중에 사용하겠으니 알아두라'는 의미로 등록해준다.

```
textures:
    data_image:
        url: ./data/20190304/total.png
```

탠그램은 특별변수인 `feature`를 통해 사용자가 레이어의 데이터의 접근한다. `extrude`는 레이어의 높이값을 설정하는데 쓰는 api인데 [서울건물연식지도](https://hanbyul-here.github.io/seoul-building-explorer/#lat=37.5749&lng=126.9761&z=16)에서 건물의 높이값을 나타내는 블락은 다음과 같다.

```
extrude: |
  function () {
    if ($zoom < 16) return 0; // 지도가 줌아웃되어있을 때는 빠른 렌더링을 위해 높이 값을 0으로 설정
    else return feature['h']; // 지도가 충분히 줌인되어있을 때는 보간한 건물의 높이값으로 값을 설정.
    // 높이를 나타내는 h는 feature의 properties 중 하나이다. 해당 레이어의 데이터 소스를 확인해보면 각각의 피쳐가 다음과 같은 프로퍼티를 가지고 있다. "properties": {"h": 27.600000, "dongCode": "1111012400", "year": "20120309"...}
  }
```
서울생활인구 프로젝트는 이 extrude값을 실제 높이 값이 아닌, fragment shader가 데이터값을 읽는데 사용할 수 있는 각 행정구역의 인덱스 넘버를 (행번호) 넘겨주는데 사용했다.

```
extrude: |
  function () {
    return (feature.id+1); // ex. 청운효자동의 경우 id의 값이 0이며, 데이터 텍스쳐의 1행에 데이터가 저장되어있다.
   }
```

이 extrude값은, 셰이더의 fragment shader를 셋업하는 position 블락에서, `worldPosition().xyz` 중 `z`값을 통해 접근할 수 있다. 포지션 블락 내에서 이 z값, (== 행정구역 인덱스 == 해당 행정구역의 데이터 텍스쳐의 행수) 을 이용해서 z값을 실제 데이터 값으로 바꿔쳐준다. 해당되는 부분의 코드를 보면 다음과 같다.

```
totalStyle:
    base: polygons
    animated: true
    shaders:
        uniforms:
            u_data: data_image // 미리 등록해둔 데이터 텍스쳐를 사용한다.
            u_param: [168, 424] // 텍스쳐 사이즈 [가로, 세로]
            u_offset: 0. // 스크립트는 이 변수의 값을 조종하면서 애니메이션을 트리거한다. (https://github.com/hanbyul-here/seoul-population-by-time/blob/master/src/slider_control.js#L222)
        blocks:
            global: |
                  vec4 getColor (vec2 st) {
                      float texWidth = u_param.x;
                      float texHeigt = u_param.y;
                      st.y = 1.-(st.y/texHeigt);
                      return texture2D(u_data,vec2(st.x/texWidth,st.y)); // 텍스쳐에서 데이터를 읽어온다.
                  }
            position: |
                vec3 pos = worldPosition().xyz;

                float zz = (position.z - .5); //
                float t = u_offset;
                float i_now = floor(t);
                float f_now = fract(t);
                float next = i_now+1.;

                vec4 data_now = getColor(vec2(mod(i_now, u_param.x) , mod(zz, u_param.y)));
                vec4 data_next = getColor(vec2(mod(next, u_param.x) , mod(zz, u_param.y)));
                vec4 data_interpol = mix(data_now,data_next,f_now); // 애니메이션을 위해 보간값을 사용한다.

                position.z = ceil(position.z /500.); // 셰이더는 폴리곤의 모든 점에 적용된다. ex. position.z = 10.0 으로 설정하면, 10의 높이를 가진 육각기둥이 아니라 바닥도, 천장도 10의 위치에 붕 떠있는 납작한 육각형이 그려진다. 그러므로 0값을 가진 점들은 0값을 지키고 데이터값을 반영해야하는 윗 쪽 점들만 포지션을 업데이트할 수 있도록 노말라이제이션 과정을 거쳐주어야한다.
                position.z *= (data_interpol.r + data_interpol.g  + data_interpol.b)*3000.;
```

 ### etc.

맨하탄 유동 인구를 시각화한 [Manhattan Population Explorer](http://manpopex.us/) 프로젝트의 움짤을 본 것이 이 프로젝트를 시작하게 된 계기였다. 나는 사실 데이터를 보이는대로 북마크해놓고 쓸 데는 나중에 생각하자는 식의 호더러인데, 서울도 유동인구 관련 데이터가 어디엔가 있었는데... 뭐였더라 하고 의식의 흐름을 따라따라 되짚어 보니 [서울의 생활인구 데이터 개방 관련](https://twitter.com/beingsince/status/969746505132228608) 소식을 트위터에서 들었던 기억이 나서 시작했는데... 어쩌다보니 시작한지 1년이 넘어 완성하고, 글로 정리하기까지 또 1년이 걸렸다.