from collections.abc import MutableMapping
from typing import TypeVar, Iterator, ItemsView, ValuesView

from pydantic import BaseModel, ConfigDict, RootModel
from pydantic.alias_generators import to_camel


class CustomBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra='forbid',
    )


T = TypeVar("T")


# FIXME: Find a way to merge the following two classes into a single one. RootModel can't
#  take two type parameters.
class RootModelStrDict(RootModel[T], MutableMapping):
    root: dict[str, T]

    def __getitem__(self, key: str) -> T:
        return self.root[key]

    def __setitem__(self, key: str, value: T):
        self.root[key] = value

    def __delitem__(self, key: str):
        del self.root[key]

    def __len__(self) -> int:
        return len(self.root)

    def __iter__(self) -> Iterator[str]:
        return iter(self.root)

    # Overriding the default implementation of items() and values() to return the correct types
    def items(self) -> ItemsView[str, T]:
        return self.root.items()

    def values(self) -> ValuesView[T]:
        return self.root.values()


class RootModelIntDict(RootModel[T], MutableMapping):
    root: dict[int, T]

    def __getitem__(self, key: int) -> T:
        return self.root[key]

    def __setitem__(self, key: int, value: T):
        self.root[key] = value

    def __delitem__(self, key: int):
        del self.root[key]

    def __len__(self) -> int:
        return len(self.root)

    def __iter__(self) -> Iterator[int]:
        return iter(self.root)

    # Overriding the default implementation of items() and values() to return the correct types
    def items(self) -> ItemsView[int, T]:
        return self.root.items()

    def values(self) -> ValuesView[T]:
        return self.root.values()