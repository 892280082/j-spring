import { Clazz, LinuxApp } from '../LinuxApp';

export class DockerHelper {
  constructor(public readonly dockerApp: DockerApp) {}

  content: string[] = ['docker run'];

  private addCmd(cmd: string): DockerHelper {
    this.content.push(cmd);
    return this;
  }

  print() {
    return this.addCmd('-it');
  }

  rm() {
    return this.addCmd('--rm');
  }

  ammount(local: string, docker: string) {
    return this.addCmd(`-v ${local}:${docker}`);
  }

  ammountRoot() {
    return this.ammount('${HOME}', '/root');
  }

  addWork(dir: string) {
    this.addCmd(`-w ${dir}`);
    return this;
  }

  ammountWithWork(cwd: string, docker: string) {
    this.ammount(cwd, docker);
    return this.addWork(docker);
  }

  port(localPort: number, dockerPort?: number) {
    dockerPort = dockerPort ?? localPort;
    return this.addCmd(`-p ${localPort}:${dockerPort}`);
  }

  excute(cmd?: string) {
    this.addCmd(`${this.dockerApp.getImageName()} ${cmd ?? ''}`);
    this.dockerApp.shell.raw(this.content.join(' '));
  }
}

/**
 * 由docker实现的APP 只需要继承dockerApp即可
 *
 * 不需要安装
 */
export abstract class DockerApp extends LinuxApp {
  //单例
  isSingleton(): boolean {
    return true;
  }
  //无需安装
  isNeedInstall(): boolean {
    return false;
  }
  //无安装逻辑
  install(): void {}
  //必须依赖Docker
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [Docker];
  }
  //无命令名称 因为docker应用无法在环境变量获取名称
  getCommdName(): string {
    return '';
  }

  getHelper(): DockerHelper {
    return new DockerHelper(this);
  }

  abstract getImageName(): string;
}

/**
 * 定义 docker 及安装
 */
export class Docker extends LinuxApp {
  isNeedInstall(): boolean {
    return true;
  }
  isSingleton(): boolean {
    return true;
  }
  getCommdName(): string {
    return 'docker';
  }
  getDepandenceList(): Clazz<LinuxApp>[] {
    return [];
  }
  printVersion(): void {
    this.shell.raw(`docker -v`);
  }
  install(): void {
    this.shell.raw(
      `curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun`
    );
  }
}
