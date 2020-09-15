# Proxy-Server-Example

此專案為一個中間層 proxy server，在取得 resource 時，會向後方的 api server 取得資料。此 server 存在目的有以下幾點 : 

* 適合處理 api server 都隱藏在內網，但是外網的 client 又需要資料。
* 適合處理 api server 多，並且要進行資料處理。
* 可以保護實際上取資料的 api server。

#### [詳細的專案說明文件請參閱此 wiki](https://github.com/h091237557/Proxy-Server-Example/wiki/%E9%96%8B%E7%99%BC%E6%B5%81%E7%A8%8B)

## Tech

* Nodejs V10.15.3
* Express
* Mocha
* PM2

## Quick Start

### Sever Start

```
git clone https://github.com/h091237557/Proxy-Server-Example.git
npm install
npm run start
```

## API

### List Heroes [GET] /heroes

**Request**

```bash
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET 127.0.0.1:3000/heroes
```

**Response 200**

```jsonc
{
  "heroes": [
    {
      "id": "1",
      "name": "Daredevil",
      "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
    },
    {
      "id": "2",
      "name": "Thor",
      "image": "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg"
    },
    // ...
  ]
}
```

### Single Hero [GET] `/heroes/:heroId`

**Request**

```bash
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET 127.0.0.1:3000/heroes/1
```

**Response 200**

```jsonc
{
  "id": "1",
  "name": "Daredevil",
  "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
}
```

**Response 404**

```jsonc
{
    "error" : "Empty Resource Error"
}
```


### Authenticated List Heroes [GET] `/heroes`

**Request**

```bash
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Name: hahow" -H "Password: rocks" -X GET 127.0.0.1:3000/heroes
```

**Response 200**

```jsonc
{
  "heroes": [
    {
      "id": "1",
      "name": "Daredevil",
      "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
      "profile": {
        "str": 2,
        "int": 7,
        "agi": 9,
        "luk": 7
      },
    },
    {
      "id": "2",
      "name": "Thor",
      "image": "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg"
      "profile": {
        "str": 8,
        "int": 2,
        "agi": 5,
        "luk": 9
      },
    },
    // ...
  ]
}
```

**Response 401**

```jsonc
{
    "error" : "Unauthorized"
}
```

### Authenticated Single Heroes [GET] `/heroes/:heroId`

**Request**

```bash
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Name: hahow" -H "Password: rocks" -X GET 127.0.0.1:3000/heroes/1
```

**Response 200**

```jsonc
{
  "id": "1",
  "name": "Daredevil",
  "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
  "profile": {
    "str": 2,
    "int": 7,
    "agi": 9,
    "luk": 7
  }
}
```

**Response 401**

```jsonc
{
    "error" : "Unauthorized"
}
```

**Response 404**

```jsonc
{
    "error" : "Empty Resource Error"
}
```
