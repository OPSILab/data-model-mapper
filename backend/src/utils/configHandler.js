module.exports = {
    mergeConfig: (config, configIn) => {
        for (let key in configIn) {
            if (typeof configIn[key] === 'object' && !Array.isArray(configIn[key]) && configIn[key] !== null)
                configIn[key] = module.exports.mergeConfig(config[key], configIn[key])
            if (configIn[key] == null || configIn[key] == undefined)
                configIn[key] = config[key]
            if (configIn[key] === "true")
                configIn[key] = true
            if (configIn[key] === "false")
                configIn[key] = false
            if (configIn[key] === "undefined")
                config[key] = configIn[key] = undefined
            if (key == "site")
                config.idSite = configIn.idSite = configIn.site
            if (key == "group")
                config.idGroup = configIn.idGroup = configIn.group
            if (key == "service")
                config.idService = configIn.idService = configIn.service
        }
        return {
            ...config,
            ...configIn
        };
    }
}