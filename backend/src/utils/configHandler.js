// A value worth descending into: a plain object. Arrays are replaced wholesale, not merged
// element by element, and everything else is a leaf.
const isMergeable = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

module.exports = {
    mergeConfig: (config, configIn) => {
        // The recursion below descends with config[key], so the base can turn out to be something
        // that must not be spread:
        //  - undefined, when configIn introduces a nested object the base does not have. One level
        //    survived by accident (the spread tolerates undefined), two levels threw "Cannot read
        //    properties of undefined". Reachable now that a request carries a partial variation.
        //  - a string, when the base holds a scalar where configIn sends an object. Spreading a
        //    string yields its characters under numeric keys: {regexClean: "abc"} merged with
        //    {regexClean: {custom: "x"}} produced {0:"a",1:"b",2:"c",custom:"x"}.
        // Normalising a non-mergeable base to {} handles both: the incoming object simply replaces
        // it, which is the same "configIn wins" rule applied to leaves.
        if (!isMergeable(config)) config = {}
        for (let key in configIn) {
            if (isMergeable(configIn[key]))
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