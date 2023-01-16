# 区块链培训作业

请大家 fork 本仓库后答题，做完后提交自己的软件仓库链接。

## 第 1 题：Solidity 语言有哪些数据类型？

例如：

-   bool
-   int8

评分标准：每个数据类型计 1 分  
参考资料： https://docs.soliditylang.org/en/latest/types.html

答案：
-   值类型：布尔类型（bool）、整型（int）、地址类型（address）、定长字节数组（bytes）、枚举类型（enum）、函数类型（function）
-   引用类型：字符串（string）、数组（array）、结构体（structs）、映射（mapping）、不定长字节数组（bytes）

## 第 2 题：列举并测试以太坊的 JSONRPC API。

评分标准：每条有效的（提供文本命令和测试截图） API 计 2 分，例如：

---

第 1 个 API： net_version

```shell
curl -s -X POST -H "Content-Type: application/json" https://matic-mumbai.chainstacklabs.com \
-d '{"id":1,"jsonrpc":"2.0","method":"net_version","params":[]}' | jq
```

![1673317288973](https://user-images.githubusercontent.com/7695325/211447294-e9e142c1-0fec-4588-9c8a-7ebfbd38a907.png)

---
答案：
-   第1个API：net_version
curl --location --request POST 'https://matic-mumbai.chainstacklabs.com/' \
--header 'content-type: application/json' \
--data-raw '{"jsonrpc": "2.0", "method": "net_version", "params": [], "id": 67}'

-   截图
![img_v2_65e63b35-9fb2-4752-940e-621a68937f6g](https://user-images.githubusercontent.com/40379005/212618523-23cb8558-1a91-4d9c-952d-6666c472c86f.jpg)


-   第2个API：net_peerCount
curl --location --request POST 'https://matic-mumbai.chainstacklabs.com/' \
--header 'content-type: application/json' \
--data-raw ' {"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}'
-   截图
![img_v2_05e3b336-9d5e-4a3e-b24c-7ff91fab2fbg](https://user-images.githubusercontent.com/40379005/212618374-e81f88fd-4996-4441-832b-eb402373c0b3.jpg)



## 第 3 题：同一个合约里代码相同的函数，为什么 GAS 费不同？

请用 Remix 验证在同一个合约里，名称不同、代码相同的函数的 GAS 费不相等，并解释原因。

评分标准：

-   验证成功： 10 分，对过程要截图
-   解释正确： 10 分

## 第 4 题：用 Remix 部署校验合约

用 Remix 写一个合约，部署到 mumbai 链上，计算 mumbai 链的最近平均出块时间，并校验合约代码代码。

评分标准：

-   代码正确：截图 10 分
-   部署成功：截图 10 分
-   代码校验：截图 5 分
-   获取结果：截图 5 分

## 第 5 题：黑名单 ERC20 合约

### 5.1 修复 BlacklistTokenFactory 合约里的 bug

命令 `yarn deploy:mumbai` 会在 mumbai 链上部署 BlacklistTokenFactory 和一个 BlacklistToken 合约（简称 BT1 ），地址保存在 deploy/deployed/mumbai.json 文件里（提示：删除该文件可以重新部署）。请在区块链浏览器上调用 BlacklistTokenFactory 合约里的 createBlacklistToken 函数，动态创建一个 BlacklistToken 合约（简称 BT2 ）， BT2 的地址保存在 BlacklistTokenFactory 的 blacklistTokens 数组里，也可以在交易里的 CreateBlacklistToken 事件里查看 BT2 的地址。因为目前 BlacklistTokenFactory 合约里有 bug，导致 `yarn test` 报告某些测试用例失败。请在区块链浏览器上比较 BT1 和 BT2 的功能，找出 BT2 功能异常的问题现象。并尝试修复合约 contracts/BlacklistTokenFactory.sol 的代码，能通过文件 test/BlacklistTokenFactory.test.js 里全部的自动化测试。

评分标准：

-   找到问题现象： 截图 10 分
-   解释问题原因： 10 分
-   修改合约代码： 20 分
-   自动化测试全部通过： 10 分

### 5.2 优化 BlacklistTokenFactory.test.js

参考： https://hardhat.org/tutorial/testing-contracts , 使用 loadFixture 重构 test/BlacklistTokenFactory.test.js 文件。

评分标准： 30 分

### 5.3 增强 BlacklistToken 合约的功能

修改本代码仓库里的 BlacklistToken 合约代码，在转账的时候抽取 10% 的手续费，并把被扣除的手续费转给合约的创建者。

评分标准：

-   代码正确： 30 分
-   部署成功： 10 分
-   代码校验： 10 分
-   手工测试： 10 分
-   
### 5.4 对 BlacklistToken 合约进行自动化测试

目前 BlacklistToken 还没有写测试用例，请在 test/BlacklistToken.test.js 文件里尽量补齐。可参考 https://hardhat.org/tutorial/testing-contracts 和网上其它开源项目的测试用例。

评分标准：每个有效的（能执行通过）测试用例 10 分，性质相同的用例不重复计分
