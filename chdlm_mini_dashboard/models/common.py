from collections.abc import MutableMapping
from typing import TypeVar

from pydantic import BaseModel, ConfigDict, RootModel
from pydantic.alias_generators import to_camel


class CustomBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra='forbid',
    )

T = TypeVar("T")

class RootModelDict(RootModel[T], MutableMapping):
    root: dict[str, T]

    def __getitem__(self, key):
        return self.root[key]

    def __setitem__(self, key, value):
        self.root[key] = value

    def __delitem__(self, key):
        del self.root[key]

    def __iter__(self):
        return iter(self.root)

    def __len__(self):
        return len(self.root)
