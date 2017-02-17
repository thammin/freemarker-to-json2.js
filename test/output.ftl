{
  "page": ${get(page)},

  "sphere": ${get(sphere)},

  "profile": ${get(profile)},

  "profileLabelList": 
  <@arrayFrame profileLabelList; item>{
    "name": ${get(item, 'name')},

    "value": ${get(item, 'value')},

    "sphere": ${get(item, 'sphere')}
  }</@arrayFrame>,

  "object": {
    "a": {
      "b": {
        "c": ${get(object, 'a.b.c')}
      }
    }
  },

  "deepArray": 
  <@arrayFrame deepArray; item>{
    "first": {
      "value": ${get(item, 'first.value')},

      "deeper": {
        "hey": ${get(item, 'first.deeper.hey')}
      },

      "deeperArray": 
      <@arrayFrame item.first.deeperArray; item>{
        "very": ${get(item, 'very')}
      }</@arrayFrame>
    }
  }</@arrayFrame>,

  "doubleArray": 
  <@arrayFrame doubleArray; item>{
    "deeperArray": 
    <@arrayFrame item.deeperArray; item>{
      "a": ${get(item, 'a')}
    }</@arrayFrame>
  }</@arrayFrame>,

  "primitiveArray": 
  <@arrayFrame primitiveArray; item>${get(item)}</@arrayFrame>
}