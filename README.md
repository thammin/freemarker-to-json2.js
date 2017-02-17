# freemarker-to-json2.js

This module take a yaml file and convert it to a freemarker file that output the data as valid json format.

Example: 

Convert this
```yaml
name: paul
id: 1
favorite: 
  - type: food
    value: ramen
  - type: drink
    value: milk-tea
```

to
```ftl
{
  "name": ${get(name)},
  
  "id": ${get(id)},
  
  "favorite": 
  <@arrayFrame favorite; item>{
    "type": ${get(item, 'type')},

    "value": ${get(item, 'value')}
  }</@arrayFrame>
}
```

which the `get`, `arrayFrame` is just a convenient way to transform ftl data to valid json.

```ftl
<#-- A simple helper to convert ftl data to valid json value -->
<#function value input="">
  <#if input?is_number>
    <#return input?c>

  <#elseif input?is_boolean>
    <#return input?string>

  <#elseif input?is_string>
    <#return '"' + input?js_string + '"'>

  <#elseif input?is_date>
    <#return '"' + input?string["yyyy/MM/dd HH:mm:ss"] + '"'>

  </#if>
</#function>

<#-- A lodash.get alike helper -->
<#function get object="" path="" default='""'>
    <#if object?is_hash && path != "">
        <#local childs = path?split(".")>
        <#list childs as child>
            <#if object[child]??>
                <#local object = object[child]>
            <#else>
                <#return default>
            </#if>
        </#list>
    </#if>

    <#return value(object)>
</#function>

<#-- A simple helper to wrap freemarker `#list` with json array -->
<#macro arrayFrame items=[]>
    <#compress>
    [
        <#list items as item>
            <#nested item><#if item_has_next>,</#if>
        </#list>
    ]
  </#compress>
</#macro>
```

# Usage

```js
const transform = require('freemarker-to-json2')

transform('input.yaml', 'output.ftl')
  .then(result => console.log(result)) // same as output.ftl
```

# Test

```sh
npm test
```