const {SpringResource} = require("../resource/SpringResource")
const {scanerDirList} = require("../scaner/scaner")


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class SpringFactory {

	/**
		rootPath:"",
		dirList:[],
		tempJsName:"runtemp.js",
		resourceDir:"resource",
		inputArgs:[]
	*/
	args;

	//SpringResource
	resource;

	//类型引用管理
	classReferences;

	//bean定义集合
	beanDefineList;

	//bean缓存 默认全部是单例
	_beanCache={};

	constructor(args,classReferences){
		this.args = args;
		const {resourceDir,dirList} = args;
		this.resource = new SpringResource(resourceDir);
		this.classReferences = classReferences;
		this.beanDefineList = scanerDirList(dirList)
	}


	/**
		根据类名获取bean的定义信息
		String => BeanDefine
		throw 'no beanDefine name {}'
	*/
	getBeanDefineByName(name){
		return this.beanDefineList.find(v => v.name === name);
	}

	/**
	   获取具有指定注解的定义
		String => [BeanDefine]
	*/
	getBeanDefineByAnnotation(annotationName){
		return this.beanDefineList.filter(beanDefine =>  beanDefine.hasAnnotation(annotationName))
	}

	/**
		根据类名获取bean 优先使用缓存 默认全部单例
	*/
	assembleBeanByBClassName(className)  {
		if(this._beanCache[className]){
			return this._beanCache[className]
		}
		const bean = assembleBeanByBeanDefine(getBeanDefineByClassName(className))
		this._beanCache[className] = bean;
		return bean;
	}

	/**
		根据beanDefine组装bean
	*/
	assembleBeanByBeanDefine(beanDefine) {

		if(this._beanCache[beanDefine.name])
			return this._beanCache[beanDefine.name];

		const bean = new this.classReferences[beanDefine.name]

		beanDefine.fields.forEach(field => {

			if(field.hasAnnotation("Value")){
				const {value} = field.getAnnotation("Value").param;
				bean[field.name] = this.resource.getValue(value)
			}

			if(field.hasAnnotation("Autowird")){
				const value = field.getAnnotation("Autowird").param.value || capitalizeFirstLetter(field.name);
				const subBeanDefine = this.getBeanDefineByName(value)
				bean[field.name] = this.assembleBeanByBeanDefine(subBeanDefine)
			}

		})

		this._beanCache[beanDefine.name] = bean;

		return bean;
	}

	//1.启动
	boot(){

		const beanDefineList = this.getBeanDefineByAnnotation("SprintBoot");

		if(beanDefineList.length == 0){
			throw 'error: not find @SpringBoot bean'
		}

		if(beanDefineList.length > 1){
			throw 'error: found more than one @SpringBoot bean'
		}

		const bean = this.assembleBeanByBeanDefine(beanDefineList[0])

		bean.main(this.args.inputArgs);

	}

}

module.exports = {SpringFactory}