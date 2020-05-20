exports.up = function(knex) {
    return knex.schema
    .createTable('roles', tbl => {
        tbl.increments();
        tbl.string('role', 128);
    })
    .createTable('users', tbl => {
        tbl.increments();

        tbl.string('username', 128).notNullable();
        tbl.string('password', 128).notNullable();
        tbl.string('department', 128).notNullable();
        tbl.integer('role')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('roles');
    });
};

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
}; 