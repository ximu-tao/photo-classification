# 部分软件设计说明文档

# 存储数据格式

> 存储数据格式, 指 config.json 中的用户配置数据的格式

```json
{
  "keymapList" : [
    {
      "configName": "config1",
      "keymap": {
        "0": "D:\\",
        "1": "C:\\",
        //      ...
        "y": "",
        "z": ""
      }
    },
    //      ...
  ],
  "basicKeymap": {
    "enabled": false,
    "data": 0
  }
}
```
