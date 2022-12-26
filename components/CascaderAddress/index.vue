<!-- <template>
	<van-cascader
		:value="selectValue"
		title="请选择所在地区"
		:options="options"
		@close="close"
		@finish="onFinish"
	/>
</template>

<script>
import province from '@/json/province.json';
import city from '@/json/city.json';
import county from '@/json/county.json';
import town from '@/json/town.json';
export default {
	name: 'cascaderAddress',
	props: {
		finish: {
			type: Function
		},
		close: {
			type: Function
		}
	},
	data() {
		return {
			selectValue: '',
			city,
			county,
			province,
			town
		};
	},
	computed: {
		options() {
			let _this = this;
			if (this.province) {
				return this.province.map((n, index) => {
					let citys = [];
					if (city) {
						citys = _this.city[n.id].map(c => ({
							text: c.name,
							value: c.id,
							children: _this.county[c.id]
								? _this.county[c.id].map(cc => ({
										text: cc.name,
										value: cc.id
								  }))
								: _this.town[c.id]
								? _this.town[c.id].map(cc => ({
										text: cc.name,
										value: cc.id
								  }))
								: []
						}));
					}
					const pro = {
						text: n.name,
						value: n.id,
						children: citys
					};
					return pro;
				});
			}
			return [];
		}
	},
	methods: {
		onFinish(event) {
			const { value, tabIndex, selectedOptions } = event.detail;
			const fieldValue = selectedOptions.map(option => option.text || option.name).join('/');
			this.$emit('finish', fieldValue);
		}
	}
};
</script>

<style></style>
 -->