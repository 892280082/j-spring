const { AttributeAnnotation,Annotation } = require("./Annotation")


class Field extends AttributeAnnotation{

	constructor(name,annotationInfo){
		super(name,annotationInfo)
	}

}

class Method extends AttributeAnnotation{

	constructor(name,annotationInfos){
		super(name,annotationInfos)
	}

	params=[];//方法的参数列表
}

class BeanDefine extends AttributeAnnotation{

	constructor(fsPath,name,annotationInfos){
		super(name,annotationInfos)
		this.fsPath = fsPath;
	}

	fsPath;//String 文件路径

	fields=[]; //[Field]; 字段

	methods=[];//[Method] 方法

	/**
		获取拥有指定注解的字段
		String => [Field]
	*/	
	getFiledByAnnotation(annotationName){

	};

	/**
		获取拥有指定注解的方法
		String => [Method]
	*/
	getMethodByAnnotation(annotationName){

	}

}


module.exports = {Annotation,Field,Method,BeanDefine}