import { exec } from 'child_process';
// https://github.com/itzg/docker-minecraft-server
export default function startServer(tag, path, customServerProps, ) {
    let serverProperties = '';

    for (const prop in customServerProps) {
        // -e EULA=TRUE 
        // -e MEMORY=2G 
        serverProperties += `-e ${prop}=${customServerProps[prop]} `;
    }

    const cmd = `docker run 
        -d 
        -it 
        --name ${tag}
        -v ${path}:/data 
        ${serverProperties}
        -p 25565:25565 
        itzg/minecraft-server`;

    const did_start = 
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });

    return did_start;
}