import {
	VantComponent
} from '../../../common/component';
VantComponent({
	props: {
		title: {
			type: String,
			value: '日期选择',
		},
		subtitle: String,
		showTitle: Boolean,
		showSubtitle: Boolean,
		firstDayOfWeek: {
			type: Number,
			observer: 'initWeekDay',
		},
	},
	data: {
		weekdays: [],
	},
	created() {
		this.initWeekDay();
	},
	methods: {
		initWeekDay() {
			const defaultWeeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			const firstDayOfWeek = this.data.firstDayOfWeek || 0;
			this.setData({
				weekdays: [
					...defaultWeeks.slice(firstDayOfWeek, 7),
					...defaultWeeks.slice(0, firstDayOfWeek),
				],
			});
		},
		onClickSubtitle(event) {
			this.$emit('click-subtitle', event);
		},
	},
});
