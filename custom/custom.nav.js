var custom = {
    init_main_sections: function (a_sections) {
        $("body").append("<div id='custom-favs'>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</div>")
        a_sections.push({code: 'favs', type: 'expand', title: 'Favorites', description: 'Content favs', id_content: 'custom-favs'});
        $("body").append("<div id='custom-admin'>Laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</div>")
        a_sections.push({code: 'admin', type: 'expand', title: 'Administration', description: 'Administration items', id_content: 'custom-admin'});
    },
    init_foot_sections: function (a_sections) {
        $("body").append("<div id='custom-eproc'>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</div>")
        a_sections.push({code: 'msg-eproc', type: 'expand-link', title: 'e-Procurement messages', description: 'e-Procurement messages', id_content: 'custom-eproc'});
        $("body").append("<div id='custom-personal'>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</div>")
        a_sections.push({code: 'msg-personal', type: 'expand-link', title: 'Personal agenda', description: 'Personal agenda', id_content: 'custom-personal'});
    }
};