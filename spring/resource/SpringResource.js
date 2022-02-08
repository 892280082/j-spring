const {File} = require("../util/File")

class SpringResource {

	data = {};

	constructor(assertDirPath){

		const resourceFile = new File(assertDirPath);

		if(resourceFile.isDir()){

			new File(assertDirPath).getFileList().map(f => new File(f))
			.filter(f => f.getExtName() ==='.json')
			.forEach(f => {

				this.data[f.getFileName(true)] = f.getObject()

			})

		}

	}

	/**
		根据key路径获取值 
		例如config.json 
		{
			"msg":"hello world!",
			"email":{
				"user":"892280082@qq.com"
			}
		}
		call getValue("config.email.user") => 892280082@qq.com
	*/
	getValue(key){
		try{
			return key.split(".").reduce((s,v) => {
				return s[v];
			},{...this.data})
		}catch(e){
			throw `read resource config error:${key}`
		}
	}


}


module.exports = {SpringResource}