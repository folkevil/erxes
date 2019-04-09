import { Button, ControlLabel } from 'modules/common/components';
import { __, router } from 'modules/common/utils';
import { IBoard, IPipeline } from 'modules/deals/types';
import * as React from 'react';
import Select from 'react-select-plus';
import { FlexItem } from '../../styles';
import { IQueryParams } from '../../types';
import { selectOptions } from '../../utils';
import Filter from './Filter';

type Props = {
  queryParams: IQueryParams;
  history: any;
  pipelines: IPipeline[];
  boards: IBoard[];
};

type States = {
  boardId: string;
  pipelineIds: string[];
};

class DealFilter extends React.Component<Props, States> {
  constructor(props) {
    super(props);

    const { boardId = '', pipelineIds = '' } = props.queryParams || {};

    this.state = {
      boardId,
      pipelineIds: pipelineIds.split(','),
      ...props.queryParams
    };
  }

  onPipelineChange = (pipelines: any) => {
    this.setState({ pipelineIds: pipelines.map(el => el.value) });
  };

  onBoardChange = (board: any) => {
    this.setState({ boardId: board && board.value });

    const { history } = this.props;
    router.setParams(history, {
      pipelineIds: '',
      boardId: board && board.value
    });
  };

  onApplyClick = () => {
    const { history } = this.props;
    const { pipelineIds, boardId } = this.state;

    router.setParams(history, {
      pipelineIds: (pipelineIds || []).join(','),
      boardId
    });
  };

  renderPipelines() {
    const { pipelines } = this.props;

    const options = option => (
      <div className="simple-option">
        <span>{option.label}</span>
      </div>
    );

    return (
      <FlexItem>
        <ControlLabel>{__('Pipelines')}</ControlLabel>

        <Select
          placeholder={__('Choose pipelines')}
          value={this.state.pipelineIds || []}
          onChange={this.onPipelineChange}
          optionRenderer={options}
          options={selectOptions([{ _id: '', name: __('All') }, ...pipelines])}
          multi={true}
        />
      </FlexItem>
    );
  }

  renderBoards() {
    const { boards } = this.props;

    const options = option => (
      <div className="simple-option">
        <span>{option.label}</span>
      </div>
    );

    return (
      <FlexItem>
        <ControlLabel>{__('Boards')}</ControlLabel>

        <Select
          placeholder={__('Choose board')}
          value={this.state.boardId || ''}
          onChange={this.onBoardChange}
          optionRenderer={options}
          options={selectOptions([{ _id: '', name: __('All') }, ...boards])}
        />
      </FlexItem>
    );
  }

  render() {
    const { queryParams, history } = this.props;

    const content = () => {
      return (
        <>
          {this.renderBoards()}
          {this.renderPipelines()}
        </>
      );
    };

    const applyBtn = () => {
      return (
        <Button btnStyle="success" icon="apply" onClick={this.onApplyClick}>
          Apply
        </Button>
      );
    };

    return (
      <Filter
        queryParams={queryParams}
        history={history}
        content={content}
        applyBtn={applyBtn}
      />
    );
  }
}

export default DealFilter;