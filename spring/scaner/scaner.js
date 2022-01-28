const {parseFile} = require("./parseFile")
const {Annotation,Field,Method,BeanDefine} = require("../beandefine/Define")
const {File} = require("../util/File")

//将解析的原始数据转换成bean定义对象
const convertToBeanDefine = originData => {
	//console.log(JSON.stringify(originData,null,2))
	const {name,annotations,methods,fields,fsPath} = originData;
	const beanDefine = new BeanDefine(fsPath,name,annotations);
	beanDefine.fields = fields.map(f => new Field(f.name,f.annotationInfos))
	beanDefine.methods = methods.map(f => new Method(f.name,f.annotationInfos))
	//console.log(JSON.stringify(beanDefine,null,2))
	return beanDefine;
}

//递归扫描目录
const scanerDir = dirPath =>{
	return new File(dirPath).getFileListRecurse() //递归获取所有的文件
		.map(parseFile) //解析文件
		.reduce((s,v)=> [...s,...v] ,[]) // 合并
		.filter(v => v.annotations.length > 0) //出去没有注解的bean
		.map(convertToBeanDefine) //原始数据信息 转换成beanDefine
}

//扫描目录集合
const scanerDirList = dirPathList => dirPathList.map(scanerDir).reduce((s,v) => {
	return [...s,...v]
},[])

module.exports = {scanerDir,scanerDirList}