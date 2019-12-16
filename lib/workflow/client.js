const ApiClient = require('../api');
const { isUndefined } = require('lodash');
const { MissingParamError } = require('../../errors');

class Workflow {
  constructor(settings, user) {
    const headers = {
      // eslint-disable-next-line camelcase
      Authorization: `bearer ${user.access_token}`,
      'Content-type': 'application/json'
    };
    Object.defineProperty(this, 'client', { value: ApiClient(settings, { headers }) });
    Object.defineProperty(this, 'profile', {
      get() {
        return user.profile || {};
      }
    });
  }

  validate(data, ...params) {
    params.forEach(param => {
      if (isUndefined(data[param])) {
        throw new MissingParamError(param);
      }
    });
  }

  _pack(params) {
    return {
      ...params,
      changedBy: this.profile.id
    };
  }

  create(params) {
    this.validate(params, 'model');
    const { data = {}, meta = {}, model } = params;
    return this.client('/', {
      method: 'POST',
      json: this._pack({
        data,
        meta,
        model,
        action: 'create'
      })
    });
  }

  update(params) {
    this.validate(params, 'id', 'model');
    const { data = {}, meta = {}, model, id, action } = params;
    return this.client('/', {
      method: 'POST',
      json: this._pack({
        data,
        meta,
        model,
        id,
        action: action || 'update'
      })
    });
  }

  delete(params) {
    this.validate(params, 'id', 'model');
    const { data = {}, id, model, meta } = params;
    return this.client('/', {
      method: 'POST',
      json: this._pack({
        data,
        id,
        model,
        meta,
        action: 'delete'
      })
    });
  }

  task(taskId) {
    return {
      read: () => this.client(`/${taskId}`),
      comment: ({ comment, meta }) => {
        this.validate({ comment, taskId }, 'comment', 'taskId');
        return this.client(`/${taskId}/comment`, {
          method: 'POST',
          json: this._pack({
            comment,
            meta
          })
        });
      },
      updateComment: ({ id, comment, meta }) => {
        this.validate({ id, comment, taskId }, 'id', 'comment', 'taskId');
        return this.client(`/${taskId}/comment/${id}`, {
          method: 'PUT',
          json: this._pack({
            comment,
            meta
          })
        });
      },
      deleteComment: ({ id }) => {
        this.validate({ id }, 'id');
        return this.client(`/${taskId}/comment/${id}`, {
          method: 'DELETE'
        });
      },
      status: ({ status, meta, data }) => {
        this.validate({ status, taskId }, 'status', 'taskId');
        return this.client(`/${taskId}/status`, {
          method: 'PUT',
          json: this._pack({
            status,
            meta,
            data
          })
        });
      },
      extend: ({ comment }) => {
        this.validate({ comment }, 'comment');
        return this.client(`/${taskId}`, {
          method: 'PUT',
          json: this._pack({
            data: { extended: true },
            meta: { comment }
          })
        });
      }
    };
  }

  profileTasks(profileId) {
    return this.client(`/profile-tasks/${profileId}`);
  }

  list({ query }) {
    return this.client('/', { query });
  }

  openTasks(modelId) {
    return this.client(`/model-tasks/${modelId}`);
  }
}

module.exports = Workflow;
