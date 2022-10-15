## 第一题 联合类型

### 题目描述
补充 Person 类， 使得代码不报错。

### 前置知识
* 联合类型
### 题目代码
```
interface User {
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  name: string;
  age: number;
  role: string;
}

export type Person = unknown;

export const persons: User[] /* <- Person[] */ = [
  {
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  {
    name: "Jane Doe",
    age: 32,
    role: "Administrator",
  },
  {
    name: "Kate Müller",
    age: 23,
    occupation: "Astronaut",
  },
  {
    name: "Bruce Willis",
    age: 64,
    role: "World saver",
  },
];

export function logPerson(user: User) {
  console.log(` - ${user.name}, ${user.age}`);
}

persons.forEach(logPerson);
```
### 思路
不难发现 persons 数组既有 User 又有 Admin。因此 person 的函数签名应该是两者的联合类型。而题目又让我们补充 Person，于是代码将 Person 定义为 Admin 和 User 的联合类型就不难想到。
### 解决
```
export type Person = User | Admin;
```
## 第二题 类型收敛

### 题目描述
补充代码， 使得代码不报错。
### 前置知识
* 类型断言
* 类型收敛
* in 操作符
### 题目代码
```
interface User {
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  name: string;
  age: number;
  role: string;
}

export type Person = User | Admin;

export const persons: Person[] = [
  {
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  {
    name: "Jane Doe",
    age: 32,
    role: "Administrator",
  },
  {
    name: "Kate Müller",
    age: 23,
    occupation: "Astronaut",
  },
  {
    name: "Bruce Willis",
    age: 64,
    role: "World saver",
  },
];

export function logPerson(person: Person) {
  let additionalInformation: string;
  if (person.role) {
    additionalInformation = person.role;
  } else {
    additionalInformation = person.occupation;
  }
  console.log(` - ${person.name}, ${person.age}, ${additionalInformation}`);
}

persons.forEach(logPerson);
```
### 思路
由于 person 可能是 User ，也可能是 Admin 类型，而 TypeScript 没有足够的信息确定具体是哪一种。因此你使用 User 或者 Admin 特有的属性就会报错了。

### 解决
因此解决方案的基本思想就是告诉 TypeScript 「person 当前是 Admin 还是 User 类型」。有多种方式可以解决这个问题。

1将 person 断言为准确的类型。就是告诉 TypeScript ”交给我吧， person 就是 xxx 类型，有错就我的锅“。
`(person as Admin).role`
2另外一种方式是使用类型收缩，比如 is ， in， typeof ， instanceof 等。使得 Typescript 能够 Get 到当前的类型。”哦， person 上有 role 属性啊，那它就是 Admin 类型，有问题我 Typescript 的锅“
这里我们使用 in 操作符，写起来也很简单。
` if ('role' in person) {`
## 第三题 类型收敛

### 题目描述
略
### 前置知识
* 类型收敛
* is 操作符
### 题目代码
```
interface User {
  type: "user";
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: "admin";
  name: string;
  age: number;
  role: string;
}

export type Person = User | Admin;

export const persons: Person[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
];

export function isAdmin(person: Person) {
  return person.type === "admin";
}

export function isUser(person: Person) {
  return person.type === "user";
}

export function logPerson(person: Person) {
  let additionalInformation: string = "";
  if (isAdmin(person)) {
    additionalInformation = person.role;
  }
  if (isUser(person)) {
    additionalInformation = person.occupation;
  }
  console.log(` - ${person.name}, ${person.age}, ${additionalInformation}`);
}

console.log("Admins:");
persons.filter(isAdmin).forEach(logPerson);

console.log();

console.log("Users:");
persons.filter(isUser).forEach(logPerson);
```
### 思路
实际上还是 person 的类型问题， 没有被收缩到正确的类型。看题目的代码，期望效果应该是如果进入 isAdmin 内部，那么 person 就是 Admin 类型，同理进入 isUser 内部，那么 person 就是 User 类型。
这里我们期望的效果是如果 isAdmin 函数返回 true ，那么 person 就应该被收敛为 Admin，isUser 同理。
### 解决
```
export function isAdmin(person: Person): person is Admin {
  return person.type === "admin";
}

export function isUser(person: Person): person is User {
  return person.type === "user";
}
```
## 第四题 Partial

### 题目描述
改 filterUsers,根据部分内容对人员进行检错
### 前置知识
* 泛型
* Partial 泛型
### 题目代码
```
interface User {
  type: "user";
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: "admin";
  name: string;
  age: number;
  role: string;
}

export type Person = User | Admin;

export const persons: Person[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  {
    type: "admin",
    name: "Jane Doe",
    age: 32,
    role: "Administrator",
  },
  {
    type: "user",
    name: "Kate Müller",
    age: 23,
    occupation: "Astronaut",
  },
  {
    type: "admin",
    name: "Bruce Willis",
    age: 64,
    role: "World saver",
  },
  {
    type: "user",
    name: "Wilson",
    age: 23,
    occupation: "Ball",
  },
  {
    type: "admin",
    name: "Agent Smith",
    age: 23,
    role: "Administrator",
  },
];

export const isAdmin = (person: Person): person is Admin =>
  person.type === "admin";
export const isUser = (person: Person): person is User =>
  person.type === "user";

export function logPerson(person: Person) {
  let additionalInformation = "";
  if (isAdmin(person)) {
    additionalInformation = person.role;
  }
  if (isUser(person)) {
    additionalInformation = person.occupation;
  }
  console.log(` - ${person.name}, ${person.age}, ${additionalInformation}`);
}

export function filterUsers(persons: Person[], criteria: User): User[] {
  return persons.filter(isUser).filter((user) => {
    const criteriaKeys = Object.keys(criteria) as (keyof User)[];
    return criteriaKeys.every((fieldName) => {
      return user[fieldName] === criteria[fieldName];
    });
  });
}

console.log("Users of age 23:");

filterUsers(persons, {
  age: 23,
}).forEach(logPerson);
```
### 思路
大概意思是 { age: 23 } 不完整，缺失了部分 key。而题目实际上的想法应该是想根据部分内容对人员进行检错。比如可以根据 age 查， 也可以根据 name 查，也可以同时根据 age 和 name 查等，这和我们平时的搜索逻辑是一致的。

直接用 Partial 泛型即可解决，
### 解决
```
export function filterUsers(persons: Person[], criteria: Partial<User>): User[] {
    ...
}
```
## 第五题 函数重载

### 题目描述
改 filterUsers， 但要注意 DRY（Don't Repeat Yourself）。并且可以根据 personType 的不同，返回不同的类型。
### 前置知识
* 函数重载
### 题目代码
```

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

export type Person = User | Admin;

export const persons: Person[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' },
    { type: 'user', name: 'Wilson', age: 23, occupation: 'Ball' },
    { type: 'admin', name: 'Agent Smith', age: 23, role: 'Anti-virus engineer' }
];

export function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

export function filterPersons(persons: Person[], personType: string, criteria: unknown): unknown[] {
    return persons
        .filter((person) => person.type === personType)
        .filter((person) => {
            let criteriaKeys = Object.keys(criteria) as (keyof Person)[];
            return criteriaKeys.every((fieldName) => {
                return person[fieldName] === criteria[fieldName];
            });
        });
}

export const usersOfAge23 = filterPersons(persons, 'user', { age: 23 });
export const adminsOfAge23 = filterPersons(persons, 'admin', { age: 23 });

console.log('Users of age 23:');
usersOfAge23.forEach(logPerson);

console.log();

console.log('Admins of age 23:');
adminsOfAge23.forEach(logPerson);
```
### 思路
重载之后，不同的情况调用返回值就可以对应不同的类型。本题中就是：

如果 personType 是 admin，就会返回 Admin 数组。
如果 personType 是 user，就会返回 User 数组。
如果 personType 是其他 string，就会返回 Person 数组。

### 解决
```
export function filterPersons(persons: Person[], personType: 'user', criteria: Partial<Person>): User[] 
export function filterPersons(persons: Person[], personType: 'admin', criteria: Partial<Person>): Admin[] 
export function filterPersons(persons: Person[], personType: string, criteria: Partial<Person>): Person[] {
    return persons
        .filter((person) => person.type === personType)
        .filter((person) => {
            let criteriaKeys = Object.keys(criteria) as (keyof Person)[];
            return criteriaKeys.every((fieldName) => {
                return person[fieldName] === criteria[fieldName];
            });
        });
}
```
## 第六题 泛型

### 题目描述
修改 swap 函数，使得不报错。并且，我希望这个函数可以适用于任意两个变量，不管其类型一样不一样， 也不管二者类型是什么。
### 前置知识
* 泛型
### 题目代码
```
export function swap(v1, v2) {
  return [v2, v1];
}
```

```
### 解决
export function swap<U, T>(v1: T, v2: U): [U, T] {
  return [v2, v1];
}
```

## 第七题 交叉类型 和 Omit 

### 题目描述

```
Intro:

    Project grew and we ended up in a situation with
    some users starting to have more influence.
    Therefore, we decided to create a new person type
    called PowerUser which is supposed to combine
    everything User and Admin have.

Exercise:

    Define type PowerUser which should have all fields
    from both User and Admin (except for type),
    and also have type 'powerUser' without duplicating
    all the fields in the code.
```
题目大概意思是定义一个类型 PowerUser， 里面包含 User 和 Admin 的所有属性， 并且有一个字段是固定的 type: 'powerUser'。
###  前置知识

* 集合操作（交叉类型）
* & 操作符
* 泛型
* Omit 泛型

### 题目代码
```
interface User {
  type: "user";
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: "admin";
  name: string;
  age: number;
  role: string;
}

type PowerUser = Omit<User & Admin, "type"> & { type: "powerUser" };

export type Person = User | Admin | PowerUser;

export const persons: Person[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
  {
    type: "powerUser",
    name: "Nikki Stone",
    age: 45,
    role: "Moderator",
    occupation: "Cat groomer",
  },
];

function isAdmin(person: Person): person is Admin {
  return person.type === "admin";
}

function isUser(person: Person): person is User {
  return person.type === "user";
}

function isPowerUser(person: Person): person is PowerUser {
  return person.type === "powerUser";
}

export function logPerson(person: Person) {
  let additionalInformation: string = "";
  if (isAdmin(person)) {
    additionalInformation = person.role;
  }
  if (isUser(person)) {
    additionalInformation = person.occupation;
  }
  if (isPowerUser(person)) {
    additionalInformation = `${person.role}, ${person.occupation}`;
  }
  console.log(`${person.name}, ${person.age}, ${additionalInformation}`);
}

console.log("Admins:");
persons.filter(isAdmin).forEach(logPerson);

console.log();

console.log("Users:");
persons.filter(isUser).forEach(logPerson);

console.log();

console.log("Power users:");
persons.filter(isPowerUser).forEach(logPerson);

```

### 思路
从题目信息不难看出，就是让我们实现 PowerUser。

有前面的分析不难得出我们只需要：

合并 User 和 Admin 的属性即可。借助 & 操作符可以实现。即 User & Admin。
增加特有的属性 type: powerUser。首先去掉上一步合并的 type 属性， 然后继续和 { type: "powerUser" } 交叉即可。
增加 { type: "powerUser" } 之前使用内置泛型 Omit 将原本的 type 删掉即可。

### 解决
```
type PowerUser = Omit<User, "type"> & Omit<Admin, "type"> & {type:'powerUser'};
```
其实这道题目，给出的代码里  
type PowerUser = Omit<User & Admin, "type"> & { type: "powerUser" };
就是一个答案嗷，但是这样的写法我自己在TS演练场写的时候有报错，所以改成了上面这样的写法，具体为什么不行我也不清楚，有明白的小伙伴评论区可以留言解答一下～





promisefy

```
export function promisify<T>(fn: (callback:(response:ApiResponse<T>)=>void)=>void):()=>Promise<T> {
    return () =>
      new Promise((resolve,reject)=>{
        fn((response)=>{
          if(response.status === 'success'){
            resolve(response.data)
          }else{
            reject(response.error)
          }
        })
    }) 
}
```