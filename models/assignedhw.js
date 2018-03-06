module.exports = function(sequelize, DataTypes) {
	var AssignedHomework = sequelize.define("AssignedHomework", {
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
	});
	return AssignedHomework;
}