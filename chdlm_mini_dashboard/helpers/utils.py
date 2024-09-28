import asyncio
import calendar
import hashlib
import inspect
import logging
import pickle

from pendulum import Duration, DateTime, now


class CacheExpired(Exception):
    pass


class EmailSendingException(Exception):
    pass


def persistent_memoize(ttl: Duration):
    def decorator(func):
        if not inspect.iscoroutinefunction(func):
            raise TypeError("The decorated function must be a coroutine")

        async def wrapper(self, *args, **kwargs):
            key_attr_name = "_instance_keys"
            if not hasattr(self, key_attr_name):
                raise AttributeError(f"The class must have an attribute \"{key_attr_name}\" to be "
                                     f"used with {persistent_memoize.__name__}")
            instance_hash = hashlib.sha256(str(getattr(self, key_attr_name)).encode()).hexdigest()[:10]

            cache_file_path = f"/tmp/chdlm_mini_dashboard-cache-{func.__name__}-{instance_hash}.pkl"
            modification_date: DateTime
            cache_renewed = False

            try:
                with open(cache_file_path, "rb") as file:
                    (modification_date, data) = pickle.load(file)

                if now() > modification_date + ttl:
                    raise CacheExpired
            except (FileNotFoundError, CacheExpired):
                data = await func(self, *args, **kwargs)
                modification_date = now()

                with open(cache_file_path, "wb") as file:
                    pickle.dump((modification_date, data), file)
                    cache_renewed = True

            expiration_date = modification_date + ttl
            expiration_interval = expiration_date - now()
            logging.info(f"\"{func.__name__}\" {'cache renewed' if cache_renewed else 'loaded from cache'}. "
                         f"Cache expiration: {expiration_date.to_rfc822_string()} (in {expiration_interval.in_words()})")

            return data

        return wrapper

    return decorator


def get_month_name(month_number: int) -> str:
    return calendar.month_name[month_number]
